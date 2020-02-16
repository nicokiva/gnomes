import React from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ListContainer } from './content/list/ListContainer';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ReducersState } from './reducers/Reducers';

export const history = createBrowserHistory();

type AppProps = { store: Store<ReducersState, any> };

const App: React.FC<AppProps> = ({ store }) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path='/gnomes' component={ListContainer} />
          <Route exact path='/gnomes/:id' component={ListContainer} />
          <Redirect exact from='/' to='/gnomes' />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
