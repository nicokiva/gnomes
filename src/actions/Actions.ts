import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { gnomesService, MetadataType } from '../services/GnomesService';
import { GnomeType, GnomeFiltersType } from '../models/Gnome';

export interface SetGnomes {
  type: 'SET_GNOMES';
  gnomes: Array<GnomeType> | null;
}

export interface SetIsLoading {
  type: 'SET_IS_LOADING';
  isLoading: boolean;
}

export interface SetMetadata {
  type: 'SET_METADATA';
  metadata: MetadataType | null;
}

export interface SetFilters {
  type: 'SET_FILTERS';
  filters: GnomeFiltersType | undefined;
}

export type Action = SetGnomes | SetIsLoading | SetFilters | SetMetadata;

export const setIsLoading = (isLoading: boolean): SetIsLoading => ({
  type: 'SET_IS_LOADING',
  isLoading
});

export const setGnomes = (gnomes: Array<GnomeType> | null): SetGnomes => ({
  type: 'SET_GNOMES',
  gnomes
});

export const setFilters = (filters?: GnomeFiltersType) => ({
  type: 'SET_FILTERS',
  filters
});

export const setMetadata = (metadata: MetadataType | null) => ({
  type: 'SET_METADATA',
  metadata
});

export const getMetadata = (): ThunkAction<
  Promise<void>,
  {},
  {},
  AnyAction
> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(async resolve => {
      dispatch(setIsLoading(true));
      const metadata = await gnomesService.getMetadata();

      dispatch(setMetadata(metadata));
      dispatch(setIsLoading(false));
      resolve();
    });
  };
};

export const loadMoreGnomes = (
  pivotId: number | undefined = undefined,
  filters: GnomeFiltersType | undefined = undefined,
  amount: number = 20
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(async resolve => {
      const gnomes = await gnomesService.getGnomes(pivotId, filters, amount);

      dispatch(setGnomes(gnomes));
      resolve();
    });
  };
};

export const getGnomes = (
  pivotId: number | undefined = undefined,
  filters: GnomeFiltersType | undefined = undefined,
  amount: number = 20
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(async resolve => {
      dispatch(setIsLoading(true));
      const gnomes = await gnomesService.getGnomes(pivotId, filters, amount);

      dispatch(setGnomes(gnomes));
      dispatch(setIsLoading(false));
      resolve();
    });
  };
};
