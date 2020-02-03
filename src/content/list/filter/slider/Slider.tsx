import React from 'react';
import styled from 'styled-components';
import {
  Slider as MaterialSlider,
  SliderProps as MaterialSliderProps
} from '@material-ui/core';

type SliderProps = MaterialSliderProps & { label: string };

const Root = styled.div``;
const LabelStyled = styled.label`
  font-family: Roboto, Helvetica, Arial, sans-serif;
`;

const SliderContainerStyled = styled.div`
  padding: 0 5px;
`;

export const Slider: React.FC<SliderProps> = props => (
  <Root>
    <LabelStyled>{props.label}</LabelStyled>
    <SliderContainerStyled>
      <MaterialSlider {...props} />
    </SliderContainerStyled>
  </Root>
);
