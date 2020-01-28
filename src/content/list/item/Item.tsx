import React, { useRef } from 'react';
import { GnomeType } from '../../../models/Gnome';
import styled from 'styled-components';
import { history } from '../../../App';
import arrowUp from '../../../images/arrow-up.png';
import arrowDown from '../../../images/arrow-down.png';
import { QuestionAnswer } from './question-answer/QuestionAnswer';

type ItemProps = { item: GnomeType; isLast: boolean; isExpanded: boolean };

export const Root = styled.li<{
  isLast: ItemProps['isLast'];
}>`
  ${props =>
    props.isLast === false
      ? `background: linear-gradient(
    to left,
    rgb(255, 255, 255) 0%,
    rgb(199, 197, 198) 25%,
    rgb(86, 86, 86) 50%,
    rgb(199, 197, 198) 75%,
    rgb(255, 255, 255) 100%
  )
  left bottom / 100% 1px no-repeat rgb(255, 255, 255);`
      : ''}
  display: flex;
  list-style-type: none;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
`;

const ThumbnailStyled = styled.div<{ image: GnomeType['thumbnail'] }>`
  ${props => `background-image: url('${props.image}');`}
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  border: solid 1px;
  height: 100px;
  margin-right: 10px;
  width: 100px;
`;

const DescriptionStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NameStyled = styled.span`
  font-weight: bolder;
`;

const DataContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ActionContainerStyled = styled.div`
  text-align: right;
  width: 100%;
`;

const ActionStyled = styled.img`
  height: 30px;
  width: 30px;
`;

const ExtraDataStyled = styled.div<{ isVisible: boolean }>`
  display: ${props => (props.isVisible === true ? 'flex' : 'none')};
  flex-direction: column;
`;

export const Item: React.FC<ItemProps> = props => {
  const ref = useRef<HTMLLIElement>(null);

  const tryScrollTo = (isExpanded: boolean) => {
    if (isExpanded === true) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleClick = () => {
    history.push(
      `/gnomes${props.isExpanded === false ? `/${props.item.id}` : ''}`
    );
  };

  const showGnome = (id: number) => {
    history.push(`/gnomes/${id}`);
  };

  return (
    <Root
      isLast={props.isLast}
      onClick={handleClick}
      ref={ref}
      onLoad={() => {
        tryScrollTo(props.isExpanded);
      }}
    >
      <ThumbnailStyled image={props.item.thumbnail}></ThumbnailStyled>
      <DescriptionStyled>
        <DataContainerStyled>
          <NameStyled>{props.item.name}</NameStyled>
          <QuestionAnswer question='Age' answer={props.item.age} />
          <ExtraDataStyled isVisible={props.isExpanded === true}>
            <QuestionAnswer question='Height' answer={props.item.height} />
            <QuestionAnswer question='Weight' answer={props.item.weight} />
            <QuestionAnswer
              question='Hair Color'
              answer={props.item.hair_color}
            />
            <QuestionAnswer
              question='Professions'
              answer={props.item.professions.join(', ')}
            />

            {props.item.friends_linked !== undefined && (
              <QuestionAnswer
                question='Friends'
                answer={props.item.friends_linked.map(friend =>
                  friend !== undefined ? (
                    <span key={friend.id}>
                      <a
                        href='#'
                        onClick={() => {
                          showGnome(friend.id);
                        }}
                      >
                        {friend.name}
                      </a>
                      {', '}
                    </span>
                  ) : (
                    undefined
                  )
                )}
              />
            )}
          </ExtraDataStyled>
        </DataContainerStyled>

        <ActionContainerStyled>
          <ActionStyled src={props.isExpanded === true ? arrowUp : arrowDown} />
        </ActionContainerStyled>
      </DescriptionStyled>
    </Root>
  );
};
