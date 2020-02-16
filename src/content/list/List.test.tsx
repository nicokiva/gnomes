import React from 'react';
import { render } from '@testing-library/react';
import { List } from './List';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares: Array<any> = [];
const mockStore = configureStore(middlewares);

describe('List component', () => {
  test('should display loading container', () => {
    const props = { isLoading: true } as any; // Cast to any as other props are not important.
    const { getByText } = render(<List {...props} />);

    const loadingElement = getByText(/Loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('should not display anything as nothing was provided', () => {
    const props = { isLoading: false, metadata: null } as any; // Cast to any as other props are not important.
    const { queryByText, queryByTestId } = render(<List {...props} />);

    const loadingElement = queryByText(/Loading/i);
    expect(loadingElement).not.toBeInTheDocument();

    const listElement = queryByTestId('list');
    expect(listElement).not.toBeInTheDocument();
  });

  test('should display list', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const props = {
      isLoading: false,
      metadata: {
        availableAgeRange: [0, 100],
        availableWeightRange: [0, 100],
        availableHeightRange: [0, 100],
        availableHairColor: [],
        availableProfessions: [],
        availableGenres: []
      },
      gnomes: []
    } as any; // Cast to any as other props are not important.
    const { queryByText, queryByTestId } = render(
      <Provider store={store}>
        <List {...props} />
      </Provider>
    );

    const loadingElement = queryByText(/Loading/i);
    expect(loadingElement).not.toBeInTheDocument();

    const listElement = queryByTestId('list');
    expect(listElement).toBeInTheDocument();
  });
});
