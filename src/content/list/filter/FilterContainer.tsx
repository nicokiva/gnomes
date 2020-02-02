import React, { useState } from 'react';
import { Filter } from './Filter';
import { GnomeType, GnomeFiltersType } from '../../../models/Gnome';

export type FilterContainerProps = {
  onApplyFilter: (filters: GnomeFiltersType) => void;
  defaultFilters?: GnomeFiltersType;
};

export const FilterContainer: React.FC<FilterContainerProps> = ({
  onApplyFilter,
  defaultFilters
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState<GnomeType['name'] | undefined>(
    defaultFilters?.name
  );

  const handleExpandOrCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApplyFilter = () => {
    const filters: { [key in string]: string | undefined } = { name };

    handleExpandOrCollapse();
    onApplyFilter(filters);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Filter
      name={name}
      onApplyFilter={handleApplyFilter}
      onChangeName={handleChangeName}
      isExpanded={isExpanded}
      onExpandOrCollapse={handleExpandOrCollapse}
    />
  );
};
