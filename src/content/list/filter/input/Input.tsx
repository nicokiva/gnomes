import React from 'react';
import styled from 'styled-components';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type InputProps = TextFieldProps;

const TextFieldStyled = styled(TextField)`
  && {
    margin-bottom: 20px;
    width: 100%;
  }
`;

export const Input: React.FC<InputProps> = props => (
  <TextFieldStyled {...props} />
);
