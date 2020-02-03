import axios from 'axios';
import {
  GnomeType,
  GnomeFiltersType,
  GnomeFiltersEvaluationFnType
} from '../models/Gnome';
import { sortBy, max, min, uniq } from 'lodash';
import { cacheService } from './CacheService';

type ResponseType<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      data: null;
    };

export type MetadataType = {
  availableAgeRange: Array<number>;
  availableHeightRange: Array<number>;
  availableWeightRange: Array<number>;
  availableHairColor: Array<string>;
};

type ToValidateValueType = Parameters<GnomeFiltersEvaluationFnType>[0];
type ValidationValueType = Parameters<GnomeFiltersEvaluationFnType>[1];

const inclusionValidationFn: GnomeFiltersEvaluationFnType = (
  valueToValidate: ToValidateValueType,
  filter: ValidationValueType
) =>
  (typeof valueToValidate === 'string' &&
    valueToValidate.toLowerCase().includes(String(filter).toLowerCase())) ||
  false;

const isAnOptionOfValidationFn: GnomeFiltersEvaluationFnType = (
  valueToValidate: ToValidateValueType,
  filter: ValidationValueType
) =>
  (typeof valueToValidate === 'string' &&
    (filter as Array<string>)
      .map(value => value.toLowerCase())
      .includes(valueToValidate.toLowerCase())) ||
  false;

const inRangeValidationFn: GnomeFiltersEvaluationFnType = (
  valueToValidate: ToValidateValueType,
  filter: ValidationValueType
) =>
  (typeof valueToValidate === 'number' &&
    Array.isArray(filter) &&
    Number(valueToValidate) >= Number((filter as Array<Number>)[0]) &&
    Number(valueToValidate) <= Number((filter as Array<Number>)[1])) ||
  false;

type ReferencedPropertyEvaluationFnType = {
  propertyReferenced: keyof Omit<GnomeType, 'friends_linked'>;
  fn: GnomeFiltersEvaluationFnType;
};

const validations: {
  [key in keyof GnomeFiltersType]:
    | ReferencedPropertyEvaluationFnType
    | GnomeFiltersEvaluationFnType;
} = {
  name: inclusionValidationFn,
  ageRange: { propertyReferenced: 'age', fn: inRangeValidationFn },
  weightRange: {
    propertyReferenced: 'weight',
    fn: inRangeValidationFn
  },
  heightRange: {
    propertyReferenced: 'height',
    fn: inRangeValidationFn
  },
  genre: inclusionValidationFn,
  hairColor: { propertyReferenced: 'hair_color', fn: isAnOptionOfValidationFn },
  professions: inclusionValidationFn
};

class GnomesService {
  private async loadGnomes(): Promise<ResponseType<Array<GnomeType>>> {
    try {
      const response = await axios.get<{ Brastlewark: Array<GnomeType> }>(
        process.env.REACT_APP_GET_POPULATION_ENDPOINT
      );

      if (response.status !== 200) {
        return {
          success: false,
          data: null
        };
      }

      const gnomes = response.data.Brastlewark;
      const data = sortBy(gnomes, 'name').map(gnome => ({
        ...gnome,
        friends_linked: gnome.friends.map(friendName =>
          gnomes.find(currentGnome => currentGnome.name === friendName)
        )
      }));

      cacheService.set('GNOMES', data);

      return {
        success: true,
        data
      };
    } catch {
      return {
        success: false,
        data: null
      };
    }
  }

  getSublist(
    gnomes: Array<GnomeType>,
    pivotId: number,
    amount: number
  ): Array<GnomeType> {
    const index = gnomes.findIndex(gnome => gnome.id === pivotId);

    const previous = index;
    const following = gnomes.length - index;

    const perSide = amount / 2;
    if (previous >= perSide && following >= perSide) {
      return [
        ...gnomes.filter((_, i) => i > index - perSide - 1 && i < index),
        gnomes[index],
        ...gnomes.filter((_, i) => i < index + perSide + 1 && i > index)
      ];
    }

    if (previous >= perSide) {
      return [
        ...gnomes.filter(
          (_, i) =>
            i > index - perSide - following - (perSide - following) + 1 &&
            i < index
        ),
        gnomes[index],
        ...gnomes.filter((_, i) => i < index + perSide + 1 && i > index)
      ];
    }

    return [
      ...gnomes.filter((_, i) => i > index - perSide - 1 && i < index),
      gnomes[index],
      ...gnomes.filter(
        (_, i) => i < index + perSide + 1 + (perSide - previous) && i > index
      )
    ];
  }

  applyFilters(gnome: GnomeType, filters: GnomeFiltersType) {
    return Object.keys(filters)
      .filter(key => filters[key as keyof GnomeFiltersType] !== undefined)
      .every(key => {
        const validator = validations[key as keyof GnomeFiltersType];
        if (validator === undefined) {
          return true;
        }

        const filter = filters[key as keyof GnomeFiltersType];
        if (filter === undefined) {
          return true;
        }

        if (typeof validator === 'function') {
          return validator(
            gnome[key as keyof Omit<GnomeType, 'friends_linked'>],
            filter
          );
        }

        const referencedValidator = validator as ReferencedPropertyEvaluationFnType;

        return referencedValidator.fn(
          gnome[referencedValidator.propertyReferenced],
          filter
        );
      });
  }

  async getMetadata(): Promise<MetadataType | null> {
    const gnomes = await this.getAllGnomes();

    if (gnomes === null) {
      return null;
    }

    const ages = gnomes?.map(({ age }) => age);
    const heights = gnomes?.map(({ height }) => height);
    const weights = gnomes?.map(({ weight }) => weight);
    const hairColors = gnomes.map(({ hair_color }) => hair_color);

    return {
      availableAgeRange: [min(ages) || 0, max(ages) || 1000],
      availableHeightRange: [
        Math.floor(min(heights) || 0),
        Math.ceil(max(heights) || 1000)
      ],
      availableWeightRange: [
        Math.floor(min(weights) || 0),
        Math.ceil(max(weights) || 1000)
      ],
      availableHairColor: uniq(hairColors)
    };
  }

  async getAllGnomes(): Promise<Array<GnomeType> | null> {
    const loadGnomes = async () => {
      const response = await this.loadGnomes();
      if (response.success === false) {
        return null;
      }

      return response.data;
    };

    return await (cacheService.get<Array<GnomeType>>('GNOMES') || loadGnomes());
  }

  async getGnomes(
    pivotId: number | undefined = undefined,
    filters: GnomeFiltersType | undefined = undefined,
    amount: number = 20
  ): Promise<Array<GnomeType> | null> {
    const gnomes = await this.getAllGnomes();

    if (gnomes === null) {
      return null;
    }

    const filteredGnomes = gnomes.filter(
      gnome =>
        filters === undefined ||
        (filters !== undefined && this.applyFilters(gnome, filters) === true)
    );

    return filteredGnomes.length > 0
      ? this.getSublist(filteredGnomes, pivotId || filteredGnomes[0].id, amount)
      : filteredGnomes;
  }
}

export const gnomesService = new GnomesService();
