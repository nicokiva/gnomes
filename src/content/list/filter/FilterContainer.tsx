import React, { useState } from 'react';
import { Filter, FilterProps } from './Filter';
import { GnomeFiltersType } from '../../../models/Gnome';

export type FilterContainerProps = {
  onApplyFilters: (filters: GnomeFiltersType) => void;
  defaultFilters?: GnomeFiltersType;

  availableHeightRange: FilterProps['availableHeightRange'];
  availableWeightRange: FilterProps['availableWeightRange'];
  availableAgeRange: FilterProps['availableAgeRange'];
};

export const FilterContainer: React.FC<FilterContainerProps> = ({
  onApplyFilters: onApplyFilter,
  defaultFilters,
  ...availableProps
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState<FilterProps['name']>(
    defaultFilters?.name || ''
  );

  const [ageRange, setAgeRange] = useState<FilterProps['ageRange']>([
    defaultFilters?.ageRange !== undefined
      ? defaultFilters?.ageRange[0]
      : availableProps.availableAgeRange[0],
    defaultFilters?.ageRange !== undefined
      ? defaultFilters?.ageRange[1]
      : availableProps.availableAgeRange[1]
  ]);

  const [weightRange, setWeightRange] = useState<FilterProps['weightRange']>([
    defaultFilters?.weightRange !== undefined
      ? defaultFilters?.weightRange[0]
      : availableProps.availableWeightRange[0],
    defaultFilters?.weightRange !== undefined
      ? defaultFilters?.weightRange[1]
      : availableProps.availableWeightRange[1]
  ]);

  const [heightRange, setHeightRange] = useState<FilterProps['heightRange']>([
    defaultFilters?.heightRange !== undefined
      ? defaultFilters?.heightRange[0]
      : availableProps.availableHeightRange[0],
    defaultFilters?.heightRange !== undefined
      ? defaultFilters?.heightRange[1]
      : availableProps.availableHeightRange[1]
  ]);

  const handleExpandOrCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const handleResetFilter = () => {
    handleExpandOrCollapse();
    onApplyFilter({});
  };

  const handleApplyFilter = () => {
    const filters: GnomeFiltersType = {
      name,
      ageRange,
      weightRange,
      heightRange
    };

    handleExpandOrCollapse();
    onApplyFilter(filters);
  };

  const handleChangeAge = (event: any, newValue: number | number[]) => {
    setAgeRange(newValue as number[]);
  };

  const handleChangeWeightRange = (event: any, newValue: number | number[]) => {
    setWeightRange(newValue as number[]);
  };

  const handleChangeHeightRange = (event: any, newValue: number | number[]) => {
    setHeightRange(newValue as number[]);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Filter
      heightRange={heightRange}
      onChangeHeightRange={handleChangeHeightRange}
      onChangeWeightRange={handleChangeWeightRange}
      weightRange={weightRange}
      ageRange={ageRange}
      name={name}
      onApplyFilter={handleApplyFilter}
      onResetFilter={handleResetFilter}
      onChangeAgeRange={handleChangeAge}
      onChangeName={handleChangeName}
      isExpanded={isExpanded}
      onExpandOrCollapse={handleExpandOrCollapse}
      {...availableProps}
    />
  );
};
