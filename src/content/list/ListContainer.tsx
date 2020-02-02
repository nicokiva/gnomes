import React, { useState, useEffect } from 'react';
import { GnomeType, GnomeFiltersType } from '../../models/Gnome';
import { useParams } from 'react-router-dom';
import { gnomesService } from '../../services/GnomesService';
import { List, ListProps } from './List';
import { history } from '../../App';

type ListContainerProps = {};

export const ListContainer: React.FC<ListContainerProps> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [gnomes, setGnomes] = useState<Array<GnomeType> | undefined | null>(
    undefined
  );
  const [filters, setFilters] = useState<GnomeFiltersType | undefined>(
    undefined
  );

  const { id } = useParams();

  const fetchGnomes = (pivotId?: GnomeType['id'], filters?: GnomeFiltersType) =>
    gnomesService.getGnomes(pivotId, filters).then(newGnomes => {
      setGnomes(newGnomes);

      return newGnomes;
    });

  useEffect(() => {
    const gnomeAlreadyLoaded = (
      id: Number,
      gnomes: Array<GnomeType> | undefined | null
    ): boolean =>
      gnomes !== undefined &&
      gnomes !== null &&
      gnomes.find(gnome => gnome.id === Number(id)) !== undefined;

    if (id !== undefined && gnomeAlreadyLoaded(Number(id), gnomes)) {
      return;
    }

    setIsLoading(true);
    fetchGnomes(id !== undefined ? Number(id) : undefined, filters).then(
      newGnomes => {
        setIsLoading(false);
        setIsErrored(newGnomes === undefined);
      }
    );
  }, [id, filters]);

  const handleFetchMore = (pivotId: GnomeType['id']) => {
    fetchGnomes(pivotId, filters);
  };

  const handleApplyFilters = (
    filters: Parameters<ListProps['onApplyFilters']>[0]
  ) => {
    setFilters(filters);

    history.push(`/gnomes`);
  };

  return (
    <List
      filters={filters}
      onApplyFilters={handleApplyFilters}
      gnomes={gnomes}
      onFetchMore={handleFetchMore}
      isLoading={isLoading}
      isErrored={isErrored}
      id={id !== undefined ? Number(id) : undefined}
    />
  );
};
