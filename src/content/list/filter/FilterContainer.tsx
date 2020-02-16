import React, { useState } from 'react';
import { Filter, FilterProps } from './Filter';
import { GnomeFiltersType, Genre } from '../../../models/Gnome';
import { MetadataType } from '../../../services/GnomesService';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { setFilters } from '../../../actions/Actions';
import { Action } from 'redux';
import { history } from '../../../App';
import { ReducersState } from '../../../reducers/Reducers';

export type FilterContainerProps = {
  defaultFilters?: GnomeFiltersType;

  metadata: MetadataType;

  setFilters: (filters?: GnomeFiltersType) => void;
};

const FilterContainerInner: React.FC<FilterContainerProps> = ({
  defaultFilters,
  metadata,
  setFilters
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

  const [professions, setProfessions] = useState<FilterProps['professions']>(
    defaultFilters?.professions !== undefined ? defaultFilters.professions : []
  );

  const [professionsExclusion, setProfessionsExclusion] = useState<
    FilterProps['professionsExclusion']
  >(defaultFilters?.professionsExclusion || false);

  const [genre, setGenre] = useState<FilterProps['genre']>(
    defaultFilters?.genre
  );

  const handleExpandOrCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const handleResetFilter = () => {
    handleExpandOrCollapse();
    setFilters({});

    history.push(`/gnomes`);
  };

  const handleApplyFilter = () => {
    const filters: GnomeFiltersType = {
      name,
      ageRange,
      weightRange,
      heightRange,
      hairColor,
      professions,
      professionsExclusion,
      genre
    };

    handleExpandOrCollapse();
    setFilters(filters);

    history.push(`/gnomes`);
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

  const handleChangeProfessions = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setProfessions(event.target.value as string[]);
  };

  const handleChangeHairColor = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setHairColor(event.target.value as string[]);
  };

  const handleChangeProfessionsExclusion = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfessionsExclusion(event.target.checked);
  };

  const handleChangeGenre = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGenre(event.target.value as Genre);
  };

  return (
    <Filter
      genre={genre}
      onChangeGenre={handleChangeGenre}
      professionsExclusion={professionsExclusion}
      onChangeProfessionsExclusion={handleChangeProfessionsExclusion}
      professions={professions}
      onChangeProfessions={handleChangeProfessions}
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

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, Action>) => ({
  setFilters: (filters?: GnomeFiltersType) => {
    dispatch(setFilters(filters));
  }
});

const mapStateToProps = (
  state: ReducersState
): Pick<FilterContainerProps, 'defaultFilters'> => {
  const { filters } = state;

  return { defaultFilters: filters };
};

export const FilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterContainerInner);
