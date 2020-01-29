import React, { useRef, useEffect } from 'react';
import { GnomeType } from '../../models/Gnome';
import styled from 'styled-components';
import { Item } from './item/Item';

const Root = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  padding: 10px;
`;

type ListProps = {
  gnomes: Array<GnomeType> | undefined | null;
  id?: number;
};

export const List: React.FC<ListProps> = ({ gnomes, id }) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const listener = (event: {
      target: { documentElement: { offsetHeight: number } };
    }) => {
      if (
        window.innerHeight + window.scrollY >=
        event.target.documentElement.offsetHeight - 102 * 5
      ) {
        console.log('bottom');
      }

      if (window.scrollY <= 102 * 5) {
        console.log('top');
      }
    };
    document.addEventListener('scroll', listener as any);

    return () => {
      document.removeEventListener('scroll', listener as any);
    };
  });

  return gnomes !== null && gnomes !== undefined ? (
    <Root ref={ref}>
      {gnomes.map((gnome, index) => (
        <Item
          isExpanded={Number(id) === gnome.id}
          key={gnome.id}
          isLast={index === gnomes.length - 1}
          item={gnome}
        />
      ))}
    </Root>
  ) : (
    <>TEST</>
  );
};
