import React from 'react';
import {
  Checkbox as MaterialCheckbox,
  CheckboxProps as MaterialCheckboxProps,
  FormControlLabel
} from '@material-ui/core';

type CheckboxProps = MaterialCheckboxProps & { label: string };

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  ...checkboxProps
}) => (
  <FormControlLabel
    control={<MaterialCheckbox {...checkboxProps} />}
    label={label}
  />
);
