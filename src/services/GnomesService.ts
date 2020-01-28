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

  async getGnomes(
    pageNumber: number,
    pageSize: number
  ): Promise<Array<GnomeType> | null> {
    let gnomes = this.getCachedGnomes();
    if (gnomes === undefined) {
      const response = await this.loadGnomes();
      if (response.success === false) {
        return null;
      }

      gnomes = response.data;
    }

    return gnomes.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }
}

export const gnomesService = new GnomesService();
