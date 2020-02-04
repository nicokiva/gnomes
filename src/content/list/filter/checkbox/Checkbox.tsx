import React from 'react';
import {
  Checkbox as MaterialCheckbox,
  CheckboxProps as MaterialCheckboxProps,
  FormControlLabel
} from '@material-ui/core';
import styled from 'styled-components';

const FormControlLabelStyled = styled(FormControlLabel)`
  && {
    margin-left: 0;
    margin-right: 0;
  }
`;

type CheckboxProps = MaterialCheckboxProps & { label: string };

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  ...checkboxProps
}) => (
  <FormControlLabelStyled
    control={<MaterialCheckbox {...checkboxProps} />}
    label={label}
  />
);
