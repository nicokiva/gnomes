import axios from 'axios';
import { GnomeType } from '../models/Gnome';
import { sortBy } from 'lodash';

type ResponseType<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      data: null;
    };

const cacheGnomesKey = 'GNOMES_CACHE_KEY';

class GnomesService {
  private getCachedGnomes(): Array<GnomeType> | undefined {
    const gnomes = localStorage.getItem(cacheGnomesKey);

    return gnomes !== null
      ? ((JSON.parse(gnomes) as unknown) as Array<GnomeType>)
      : undefined;
  }

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
      localStorage.setItem(cacheGnomesKey, JSON.stringify(data));

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

  async getGnomes(
    pivotId: number | undefined = undefined,
    amount: number = 20
  ): Promise<Array<GnomeType> | null> {
    let gnomes = this.getCachedGnomes();

    if (gnomes === undefined) {
      const response = await this.loadGnomes();
      if (response.success === false) {
        return null;
      }

      gnomes = response.data;
    }

    return this.getSublist(gnomes, pivotId || gnomes[0].id, amount);
  }
}

export const gnomesService = new GnomesService();
