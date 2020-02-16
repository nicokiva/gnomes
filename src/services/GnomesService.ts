import axios from 'axios';

import { sortBy, max, min, uniq } from 'lodash';
import { cacheService } from './CacheService';
import {
  GnomeFiltersEvaluationFnType,
  GnomeFiltersType,
  GnomeType,
  Genre
} from '../models/Gnome';

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
  availableProfessions: Array<string>;
  availableGenres: Array<Genre>;
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

const isOneOfValidationFn: GnomeFiltersEvaluationFnType = (
  valueToValidate: ToValidateValueType,
  filter: ValidationValueType
) =>
  (typeof valueToValidate === 'string' &&
    ((filter as Array<string>).length === 0 ||
      (filter as Array<string>)
        .map(value => value.toLowerCase())
        .includes(valueToValidate.toLowerCase()))) ||
  false;

const isIncludedInValidationFn: GnomeFiltersEvaluationFnType = (
  valueToValidate: ToValidateValueType,
  filter: ValidationValueType,
  allFilters?: GnomeFiltersType
) => {
  if (
    !Array.isArray(valueToValidate) ||
    !Array.isArray(filter) ||
    allFilters === undefined
  ) {
    return false;
  }

  const gnomeProfessions = (valueToValidate as Array<string>).map(value =>
    value.toLowerCase()
  );

  if ((filter as Array<string>).length === 0) {
    return true;
  }

  const mappedFilters = (filter as Array<string>).map(value =>
    value.toLowerCase()
  );

  return (
    (allFilters.professionsExclusion === false &&
      mappedFilters.some(profession =>
        gnomeProfessions.includes(profession)
      )) ||
    (allFilters.professionsExclusion === true &&
      mappedFilters.every(profession => gnomeProfessions.includes(profession)))
  );
};

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
  [key in keyof Omit<GnomeFiltersType, 'professionsExclusion'>]:
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
  hairColor: { propertyReferenced: 'hair_color', fn: isOneOfValidationFn },
  professions: isIncludedInValidationFn
};

class GnomesService {
  private async loadGnomes(): Promise<ResponseType<Array<GnomeType>>> {
    const getGenre = (gnome: GnomeType): Genre =>
      (gnome.name.toLowerCase().match(/t/g) || []).length > 2
        ? 'Male'
        : 'Female';

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
        ),
        genre: getGenre(gnome)
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
        const validator =
          validations[
            key as keyof Omit<GnomeFiltersType, 'professionsExclusion'>
          ];
        if (validator === undefined) {
          return true;
        }

        const filter =
          filters[key as keyof Omit<GnomeFiltersType, 'professionsExclusion'>];
        if (filter === undefined) {
          return true;
        }

        if (typeof validator === 'function') {
          return validator(
            gnome[key as keyof Omit<GnomeType, 'friends_linked'>],
            filter,
            filters
          );
        }

        const referencedValidator = validator as ReferencedPropertyEvaluationFnType;

        return referencedValidator.fn(
          gnome[referencedValidator.propertyReferenced],
          filter,
          filters
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
    const hairColors = sortBy(
      gnomes.map(({ hair_color }) => hair_color),
      word => word.toLowerCase()
    );
    const professions = sortBy(
      gnomes.reduce<Array<string>>(
        (acc, gnome) => [
          ...acc,
          ...gnome.professions.map(profession => profession.trim())
        ],
        []
      ),
      word => word.toLowerCase()
    );

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
      availableHairColor: uniq(hairColors),
      availableProfessions: uniq(professions),
      availableGenres: ['Not Specified', 'Female', 'Male'] as Array<Genre>
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
