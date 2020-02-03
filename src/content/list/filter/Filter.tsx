import React from 'react';
import styled from 'styled-components';
import ArrowDown from '../../../images/arrow-down.png';
import ArrowUp from '../../../images/arrow-up.png';
import Search from '../../../images/search.png';
import { Input } from './input/Input';
import { Button } from '@material-ui/core';
import { Slider } from './slider/Slider';
import { Select } from './select/Select';

const Root = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  ${props => (props.isExpanded ? 'height: 80%;' : '')}
  position: fixed;
  width: 100%;
`;

const FiltersStyled = styled.div<{ isExpanded: boolean }>`
  background-color: #e3d199;
  color: #000;
  display: ${props => (props.isExpanded ? 'flex' : 'none')};
  flex-direction: column;
  height: 95%;
  padding: 0 20px 20px;
`;

const ButtonStyled = styled.button`
  background-color: #e3d199;
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

const ButtonBaseStyled = styled(Button)`
  && {
    border: solid 1px;
    width: 130px;
  }
`;

const ResetButtonStyled = styled(ButtonBaseStyled)`
  && {
    background-color: #fc8a82;
    margin-right: 10px;
  }
`;

const SearchButtonStyled = styled(ButtonBaseStyled)`
  && {
    background-color: #7bc67e;
  }
`;

const SearchToolbar = styled.div`
  text-align: right;
`;

export type FilterProps = {
  isExpanded: boolean;
  onExpandOrCollapse: () => void;
  onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  onChangeAgeRange: (event: any, newValue: number | number[]) => void;
  onChangeWeightRange: (event: any, newValue: number | number[]) => void;
  onChangeHeightRange: (event: any, newValue: number | number[]) => void;
  onChangeHairColor: (event: React.ChangeEvent<{ value: unknown }>) => void;

  name: string;
  ageRange: Array<number>;
  availableAgeRange: Array<number>;
  weightRange: Array<number>;
  availableWeightRange: Array<number>;
  heightRange: Array<number>;
  availableHeightRange: Array<number>;
  hairColor: Array<string>;
  availableHairColor: Array<string>;
};

export const Filter: React.FC<FilterProps> = ({
  isExpanded,
  onExpandOrCollapse,
  onChangeName,
  onChangeAgeRange,
  onChangeWeightRange,
  onChangeHeightRange,
  onApplyFilter,
  onResetFilter,
  name,
  ageRange,
  availableAgeRange,
  weightRange,
  availableWeightRange,
  heightRange,
  availableHeightRange,
  hairColor,
  availableHairColor,
  onChangeHairColor
}) => (
  <Root isExpanded={isExpanded}>
    <FiltersStyled isExpanded={isExpanded}>
      <h2>Filters</h2>

      <FiltersInputStyled>
        <Input
          value={name}
          placeholder='Matthew'
          label='Name (contains)'
          onChange={onChangeName}
          aria-labelledby='text'
        />

        <Slider
          label='Age Range'
          min={availableAgeRange[0]}
          max={availableAgeRange[1]}
          value={ageRange}
          aria-labelledby='range-slider'
          valueLabelDisplay='auto'
          onChange={onChangeAgeRange}
          marks={availableAgeRange.map(value => ({ value, label: value }))}
        />

        <Slider
          label='Weight Range'
          min={availableWeightRange[0]}
          max={availableWeightRange[1]}
          value={weightRange}
          aria-labelledby='range-slider'
          valueLabelDisplay='auto'
          onChange={onChangeWeightRange}
          marks={availableWeightRange.map(value => ({ value, label: value }))}
        />

        <Slider
          label='Height Range'
          min={availableHeightRange[0]}
          max={availableHeightRange[1]}
          value={heightRange}
          aria-labelledby='range-slider'
          valueLabelDisplay='auto'
          onChange={onChangeHeightRange}
          marks={availableHeightRange.map(value => ({ value, label: value }))}
        />

        <Select
          onChange={onChangeHairColor}
          suggestions={availableHairColor.map(hairColor => ({
            key: hairColor,
            label: hairColor
          }))}
          value={hairColor}
        />
      </FiltersInputStyled>
      <SearchToolbar>
        <ResetButtonStyled
          endIcon={<ImageStyled src={Search} />}
          onClick={onResetFilter}
        >
          Reset
        </ResetButtonStyled>

        <SearchButtonStyled
          endIcon={<ImageStyled src={Search} />}
          onClick={onApplyFilter}
        >
          Search
        </SearchButtonStyled>
      </SearchToolbar>
    </FiltersStyled>

    <ButtonStyled onClick={onExpandOrCollapse}>
      <ImageStyled src={isExpanded === true ? ArrowUp : ArrowDown} />
    </ButtonStyled>
  </Root>
);
