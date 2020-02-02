enum Genre {
  Male,
  Female
}

export type GnomeFiltersType = Partial<
  Pick<GnomeType, 'name' | 'hair_color' | 'professions' | 'genre'>
> & {
  minAge?: GnomeType['age'];
  maxAge?: GnomeType['age'];

  minWeight?: GnomeType['weight'];
  maxWeight?: GnomeType['weight'];

  minHeight?: GnomeType['height'];
  maxHeight?: GnomeType['height'];
};

export type GnomeType = {
  id: number;
  name: string;
  thumbnail: string;
  age: number;
  weight: number;
  height: number;
  hair_color: string;
  professions: Array<string>;
  friends: Array<GnomeType['name']>;
  friends_linked: Array<GnomeType | undefined>;
  genre: Genre;
};
