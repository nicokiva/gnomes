import React, { useState } from 'react';
import styled from 'styled-components';
import ArrowDown from '../../../images/arrow-down.png';
import { Input } from './input/Input';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
`;

const FiltersStyled = styled.div<{ isExpanded: boolean }>`
  background-color: #dcf1f3;
  color: #000;
  display: ${props => (props.isExpanded ? 'flex' : 'none')};
  flex-direction: column;
  height: 300px;
  padding: 0 20px 20px;
`;

const ButtonStyled = styled.button`
  background-color: #dcf1f3;
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

export const Filter: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const expandOrCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Root>
      <FiltersStyled isExpanded={isExpanded}>
        <h2>Filters</h2>
        <Input />
      </FiltersStyled>
      <ButtonStyled onClick={expandOrCollapse}>
        <ImageStyled src={ArrowDown} />
      </ButtonStyled>
    </Root>
  );
};
