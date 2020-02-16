import { MetadataType } from '../services/GnomesService';
import { GnomeType, GnomeFiltersType } from '../models/Gnome';

export type ReducersState = {
  gnomes?: Array<GnomeType> | null;
  isLoading: boolean;
  metadata?: MetadataType | null;
  filters?: GnomeFiltersType;
};

export type ReducersActionsType = any;

export const Reducers = (
  state: ReducersState = {
    gnomes: undefined,
    metadata: undefined,
    isLoading: false,
    filters: undefined
  },
  action: ReducersActionsType
) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: action.filters };
    case 'SET_METADATA':
      return { ...state, metadata: action.metadata };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_GNOMES':
      return { ...state, gnomes: action.gnomes };
    default:
      return state;
  }
};
