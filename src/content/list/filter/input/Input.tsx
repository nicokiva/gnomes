import React from 'react';
import styled from 'styled-components';

type InputProps = {};

const InputContainer = styled.div`
  position: relative;
  padding: 15px 0 0;
  width: 100%;
`;

const LabelStyled = styled.label`
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #9b9b9b;
`;

const InputStyled = styled.input`
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 1px solid #000;
  outline: 0;
  font-size: 1.3rem;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ ${LabelStyled} {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
  }

  $:focus {
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, #11998e, #38ef7d);
    border-image-slice: 1;

    &:required,
    &:invalid {
      box-shadow: none;
    }

    ~ ${LabelStyled} {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: #11998e;
      font-weight: 700;
    }
  }
`;

export const Input: React.FC<InputProps> = () => (
  <InputContainer>
    <InputStyled type='text' placeholder='Name' />
    <LabelStyled>Name</LabelStyled>
  </InputContainer>
);
