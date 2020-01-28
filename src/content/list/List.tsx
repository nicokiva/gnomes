import React from 'react';
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
  return gnomes !== null && gnomes !== undefined ? (
    <Root>
      {gnomes.map((gnome, index) => {
        return (
          <Item
            isExpanded={Number(id) === gnome.id}
            key={gnome.id}
            isLast={index === gnomes.length - 1}
            item={gnome}
          />
        );
      })}
    </Root>
  ) : (
    <>TEST</>
  );
};
