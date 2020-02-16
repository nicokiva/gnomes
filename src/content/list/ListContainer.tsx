import React, { useEffect } from 'react';
import { GnomeType, GnomeFiltersType } from '../../models/Gnome';
import { useParams } from 'react-router-dom';
import { MetadataType } from '../../services/GnomesService';
import { List } from './List';
import { connect } from 'react-redux';
import { ReducersState } from '../../reducers/Reducers';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getGnomes, getMetadata, loadMoreGnomes } from '../../actions/Actions';

type ListContainerProps = {
  gnomes?: Array<GnomeType> | null;
  metadata?: MetadataType | null;
  isLoading: boolean;
  filters?: GnomeFiltersType;

  getMetadata: () => Promise<void>;
  getGnomes: (
    pivotId?: number,
    filters?: GnomeFiltersType,
    amount?: number
  ) => Promise<void>;

  loadMoreGnomes: (
    pivotId?: number,
    filters?: GnomeFiltersType,
    amount?: number
  ) => Promise<void>;
};

const ListContainerInner: React.FC<ListContainerProps> = props => {
  const { id } = useParams();

  useEffect(() => {
    const gnomeAlreadyLoaded = (
      id: Number,
      gnomes: Array<GnomeType> | undefined | null
    ): boolean =>
      gnomes !== undefined &&
      gnomes !== null &&
      gnomes.find(gnome => gnome.id === Number(id)) !== undefined;

    if (id !== undefined && gnomeAlreadyLoaded(Number(id), props.gnomes)) {
      return;
    }

    props
      .getGnomes(id !== undefined ? Number(id) : undefined, props.filters)
      .then(() => {
        props.getMetadata();
      });
  }, [id, props.filters]);

  const handleFetchMore = (pivotId: GnomeType['id']) => {
    props.loadMoreGnomes(pivotId, props.filters);
  };

  return (
    <List
      metadata={props.metadata}
      filters={props.filters}
      gnomes={props.gnomes}
      onFetchMore={handleFetchMore}
      isLoading={props.isLoading}
      id={id !== undefined ? Number(id) : undefined}
    />
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, Action>) => ({
  getGnomes: async (
    pivotId?: number,
    filters?: GnomeFiltersType,
    amount?: number
  ) => {
    await dispatch(getGnomes(pivotId, filters, amount));
  },
  loadMoreGnomes: async (
    pivotId?: number,
    filters?: GnomeFiltersType,
    amount?: number
  ) => {
    await dispatch(loadMoreGnomes(pivotId, filters, amount));
  },
  getMetadata: async () => {
    await dispatch(getMetadata());
  }
});

const mapStateToProps = (
  state: ReducersState
): Pick<ListContainerProps, 'gnomes' | 'metadata' | 'isLoading'> => {
  const { gnomes, metadata, isLoading } = state;
  return { gnomes, metadata, isLoading };
};

export const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListContainerInner);
