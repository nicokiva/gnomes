import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GnomeType } from '../../models/Gnome';

export const List: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [gnomes, setGnomes] = useState<Array<GnomeType> | undefined | null>(
    undefined
  );

  useEffect(() => {
    setIsLoading(true);
    setIsErrored(false);

    axios
      .get<Array<GnomeType>>(process.env.REACT_APP_GET_POPULATION_ENDPOINT)
      .then(response => {
        if (response.status !== 200) {
          setGnomes(null);
          setIsErrored(true);
          setIsLoading(false);
          return;
        }

        setGnomes(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsErrored(true);
        setIsLoading(false);
      });
  }, [setIsLoading, setIsErrored, setGnomes]);

  return <>{String(isLoading)}</>;
};
