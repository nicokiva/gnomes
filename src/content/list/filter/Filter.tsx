import React from 'react';
import styled from 'styled-components';
import ArrowDown from '../../../images/arrow-down.png';
import Search from '../../../images/search.png';
import { Input } from './input/Input';
import { Button } from '@material-ui/core';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
`;

const FiltersStyled = styled.div<{ isExpanded: boolean }>`
  background-color: #dcf1f3;
  color: #000;
  display: ${props => (props.isExpanded ? 'flex' : 'none')};
  flex-direction: column;
  height: 300px;
  padding: 0 20px 20px;
`;

const ButtonStyled = styled.button`
  background-color: #dcf1f3;
  border: solid 1px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 0;
  margin: auto;
  width: 40px;

  :focus {
    outline: none;
  }
`;

const ImageStyled = styled.img`
  height: 20px;
  width: 20px;
`;

const FiltersInputStyled = styled.div`
  flex-grow: 1;
`;

const SearchButtonStyled = styled(Button)`
  && {
    background-color: #e0e0e0;
    border: solid 1px;
  }

  width: 130px;
`;

const SearchToolbar = styled.div`
  text-align: right;
`;

export type FilterProps = {
  isExpanded: boolean;
  onExpandOrCollapse: () => void;
  onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilter: () => void;

  name?: string;
};

export const Filter: React.FC<FilterProps> = ({
  isExpanded,
  onExpandOrCollapse,
  onChangeName,
  onApplyFilter,
  name
}) => (
  <Root>
    <FiltersStyled isExpanded={isExpanded}>
      <h2>Filters</h2>

      <FiltersInputStyled>
        <Input
          value={name !== undefined ? name : ''}
          placeholder='Matthew'
          label='Name (contains)'
          onChange={onChangeName}
        />
      </FiltersInputStyled>
      <SearchToolbar>
        <SearchButtonStyled
          endIcon={<ImageStyled src={Search} />}
          onClick={onApplyFilter}
        >
          Search
        </SearchButtonStyled>
      </SearchToolbar>
    </FiltersStyled>
    <ButtonStyled onClick={onExpandOrCollapse}>
      <ImageStyled src={ArrowDown} />
    </ButtonStyled>
  </Root>
);
