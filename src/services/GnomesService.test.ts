import { gnomesService } from './GnomesService';

beforeAll(() => {
  jest.mock('./GnomesService');
});

test('get metadata should return default values', async () => {
  gnomesService.getAllGnomes = jest
    .fn()
    .mockResolvedValue([])
    .bind(gnomesService);

  expect(await gnomesService.getMetadata()).toEqual({
    availableAgeRange: [0, 1000],
    availableHeightRange: [0, 1000],
    availableWeightRange: [0, 1000],
    availableHairColor: [],
    availableProfessions: [],
    availableGenres: ['Female', 'Male']
  });
});

test('get metadata should return valid ranges', async () => {
  gnomesService.getAllGnomes = jest
    .fn()
    .mockResolvedValue([
      {
        id: 61,
        name: 'Cogwitz Bitterbuster',
        thumbnail:
          'http://www.publicdomainpictures.net/pictures/10000/nahled/thinking-monkey-11282237747K8xB.jpg',
        age: 112,
        weight: 37.827232,
        height: 106.823685,
        hair_color: 'Red',
        professions: ['Carpenter'],
        friends: ['Modwell Felwhistle']
      },
      {
        id: 62,
        name: 'Pepe',
        thumbnail:
          'http://www.publicdomainpictures.net/pictures/10000/nahled/thinking-monkey-11282237747K8xB.jpg',
        age: 16,
        weight: 182,
        height: 191,
        hair_color: 'Gray',
        professions: ['Lover', 'Carpenter'],
        friends: ['Modwell Felwhistle']
      }
    ])
    .bind(gnomesService);

  expect(await gnomesService.getMetadata()).toEqual({
    availableAgeRange: [16, 112],
    availableHeightRange: [106, 191],
    availableWeightRange: [37, 182],
    availableHairColor: ['Gray', 'Red'],
    availableProfessions: ['Carpenter', 'Lover'],
    availableGenres: ['Female', 'Male']
  });
});
