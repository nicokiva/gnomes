enum Genre {
  Male,
  Female
}

export type GnomeFiltersEvaluationFnType = (
  toValidate: string | number | Array<string> | undefined,
  filter: string | number | Array<string> | Array<number>
) => boolean;

export type GnomeFiltersType = Partial<
  Pick<GnomeType, 'name' | 'hair_color' | 'professions' | 'genre'>
> & {
  ageRange?: Array<GnomeType['age']>;

  weightRange?: Array<GnomeType['weight']>;

  heightRange?: Array<GnomeType['height']>;
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
