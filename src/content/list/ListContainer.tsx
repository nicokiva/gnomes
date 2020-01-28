import React, { useState, useEffect } from 'react';
import { GnomeType } from '../../models/Gnome';
import { useParams } from 'react-router-dom';
import { gnomesService } from '../../services/GnomesService';
import { List } from './List';

export const ListContainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [gnomes, setGnomes] = useState<Array<GnomeType> | undefined | null>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { id } = useParams();

  useEffect(() => {
    const gnomeAlreadyLoaded = (
      id: Number,
      gnomes: Array<GnomeType> | undefined | null
    ): boolean =>
      gnomes !== undefined &&
      gnomes !== null &&
      gnomes.find(gnome => gnome.id === Number(id)) !== undefined;

    const gnomesAlreadyLoaded = (
      gnomes: Array<GnomeType> | undefined | null
    ): boolean => gnomes !== undefined && gnomes !== null && gnomes.length > 0;

    if (
      (id !== undefined && gnomeAlreadyLoaded(Number(id), gnomes)) ||
      (id === undefined && gnomesAlreadyLoaded(gnomes))
    ) {
      return;
    }

    setIsLoading(true);

    gnomesService.getGnomes(currentPage, 20).then(newGnomes => {
      let found = false;
      if (id === undefined) {
        found = true;
      } else {
        found =
          newGnomes !== null &&
          newGnomes.find(gnome => gnome.id === Number(id)) !== undefined;
      }

      if (newGnomes !== null) {
        if (gnomes === null || gnomes === undefined) {
          setGnomes(newGnomes);
        }

        if (
          gnomes !== null &&
          gnomes !== undefined &&
          newGnomes.every(gnome => gnomes.includes(gnome) === false)
        ) {
          setGnomes(gnomes => [...gnomes!, ...newGnomes]);
        }
      }

      if (found === false) {
        setCurrentPage(pageNumber => pageNumber + 1);
      }

      setIsLoading(false);
      setIsErrored(newGnomes === undefined);
    });
  }, [currentPage, id]);

  return (
    <List gnomes={gnomes} id={id !== undefined ? Number(id) : undefined} />
  );
};
