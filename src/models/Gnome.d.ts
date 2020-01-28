enum Genre {
  Male,
  Female
}

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
