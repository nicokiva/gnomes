import React from 'react';
import {
  Select as MaterialSelect,
  SelectProps as MaterialSelectProps,
  FormControl,
  InputLabel,
  Input,
  Chip,
  MenuItem
} from '@material-ui/core';
import styled from 'styled-components';

const FormControlStyled = styled(FormControl)`
  margin-bottom: 5px;
  width: 100%;
`;

type SelectProps = MaterialSelectProps & {
  suggestions: Array<{ label: string; key: string }>;
  label: string;
};

export const Select: React.FC<SelectProps> = props => (
  <FormControlStyled>
    <InputLabel id='demo-mutiple-chip-label'>{props.label}</InputLabel>
    <MaterialSelect
      labelId='demo-mutiple-chip-label'
      id='demo-mutiple-chip'
      input={<Input id='select-multiple-chip' />}
      renderValue={selected => (
        <div>
          {(selected as string[]).map(value => (
            <Chip key={value} label={value} />
          ))}
        </div>
      )}
      {...props}
    >
      {props.suggestions.map(suggestion => (
        <MenuItem key={suggestion.key} value={suggestion.key}>
          {suggestion.label}
        </MenuItem>
      ))}
    </MaterialSelect>
  </FormControlStyled>
);
