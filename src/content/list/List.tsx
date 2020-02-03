import React, { useRef, useEffect } from 'react';
import { GnomeType } from '../../models/Gnome';
import styled from 'styled-components';
import { Item } from './item/Item';
import { Loading } from './item/loading/Loading';
import {
  FilterContainer,
  FilterContainerProps
} from './filter/FilterContainer';
import { RangesType } from '../../services/GnomesService';

const Root = styled.div``;

const ListStyled = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0;
  overflow: hidden;
  padding: 10px;
`;

export type ListProps = {
  gnomes: Array<GnomeType> | undefined | null;
  id?: number;
  onFetchMore: (pivotId: number) => void;
  isLoading: boolean;
  isErrored: boolean;
  filters: FilterContainerProps['defaultFilters'];
  ranges: RangesType | undefined | null;
} & Pick<FilterContainerProps, 'onApplyFilters'>;

export const List: React.FC<ListProps> = ({
  gnomes,
  id,
  onFetchMore,
  isLoading,
  isErrored,
  filters,
  onApplyFilters,
  ranges
}) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const listener = (event: {
      target: { documentElement: { offsetHeight: number } };
    }) => {
      if (gnomes === null || gnomes === undefined) {
        return;
      }

      debugger;
      if (
        window.innerHeight + window.scrollY >=
        event.target.documentElement.offsetHeight - 102 * 2
      ) {
        onFetchMore(gnomes[gnomes.length - 1].id);
      }

      if (window.scrollY <= 102 * 2) {
        onFetchMore(gnomes[0].id);
      }
    };

    document.addEventListener('scroll', listener as any); // TODO: avoid any, find the correct type.

    return () => {
      document.removeEventListener('scroll', listener as any); // TODO: avoid any, find the correct type.
    };
  });

  if (isLoading === true) {
    return <Loading />;
  }

  if (isErrored === true) {
    return <>Error!</>;
  }

  if (
    gnomes === null ||
    gnomes === undefined ||
    ranges === null ||
    ranges === undefined
  ) {
    return <></>;
  }

  return (
    <Root>
      <FilterContainer
        defaultFilters={filters}
        onApplyFilters={onApplyFilters}
        {...ranges}
      />

      <ListStyled ref={ref}>
        {gnomes.map((gnome, index) => (
          <Item
            isExpanded={Number(id) === gnome.id}
            key={gnome.id}
            isLast={index === gnomes.length - 1}
            item={gnome}
          />
        ))}
      </ListStyled>
    </Root>
  );
};
