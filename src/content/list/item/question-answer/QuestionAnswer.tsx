import React from 'react';
import styled from 'styled-components';

const Root = styled.div``;

const Question = styled.span`
  font-weight: bolder;
`;

type QuestionAnswerProps = { question: string; answer: React.ReactNode };

export const QuestionAnswer: React.FC<QuestionAnswerProps> = props => (
  <Root>
    <Question>{props.question}: </Question>
    {props.answer}
  </Root>
);
