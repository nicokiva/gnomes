import React, { useState } from 'react';
import { Filter, FilterProps } from './Filter';
import { GnomeFiltersType } from '../../../models/Gnome';
import { MetadataType } from '../../../services/GnomesService';

export type FilterContainerProps = {
  onApplyFilters: (filters: GnomeFiltersType) => void;
  defaultFilters?: GnomeFiltersType;

  metadata: MetadataType;
};

export const FilterContainer: React.FC<FilterContainerProps> = ({
  onApplyFilters: onApplyFilter,
  defaultFilters,
  metadata
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState<FilterProps['name']>(
    defaultFilters?.name || ''
  );

  const [ageRange, setAgeRange] = useState<FilterProps['ageRange']>([
    defaultFilters?.ageRange !== undefined
      ? defaultFilters?.ageRange[0]
      : metadata.availableAgeRange[0] || 0,
    defaultFilters?.ageRange !== undefined
      ? defaultFilters?.ageRange[1]
      : metadata.availableAgeRange[1] || 1000
  ]);

  const [weightRange, setWeightRange] = useState<FilterProps['weightRange']>([
    defaultFilters?.weightRange !== undefined
      ? defaultFilters?.weightRange[0]
      : metadata.availableWeightRange[0] || 0,
    defaultFilters?.weightRange !== undefined
      ? defaultFilters?.weightRange[1]
      : metadata.availableWeightRange[1] || 1000
  ]);

  const [heightRange, setHeightRange] = useState<FilterProps['heightRange']>([
    defaultFilters?.heightRange !== undefined
      ? defaultFilters?.heightRange[0]
      : metadata.availableHeightRange[0] || 0,
    defaultFilters?.heightRange !== undefined
      ? defaultFilters?.heightRange[1]
      : metadata.availableHeightRange[1] || 1000
  ]);

  const [hairColor, setHairColor] = useState<FilterProps['hairColor']>(
    defaultFilters?.hairColor !== undefined ? defaultFilters.hairColor : []
  );

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
      heightRange,
      hairColor
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

  const handleChangeHairColor = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setHairColor(event.target.value as string[]);
  };

  return (
    <Filter
      hairColor={hairColor}
      heightRange={heightRange}
      onChangeHeightRange={handleChangeHeightRange}
      onChangeWeightRange={handleChangeWeightRange}
      onChangeHairColor={handleChangeHairColor}
      weightRange={weightRange}
      ageRange={ageRange}
      name={name}
      onApplyFilter={handleApplyFilter}
      onResetFilter={handleResetFilter}
      onChangeAgeRange={handleChangeAge}
      onChangeName={handleChangeName}
      isExpanded={isExpanded}
      onExpandOrCollapse={handleExpandOrCollapse}
      {...metadata}
    />
  );
};
