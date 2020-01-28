import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ListContainer } from './content/list/ListContainer';

export const history = createBrowserHistory();

const App: React.FC = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/gnomes' component={ListContainer} />
        <Route exact path='/gnomes/:id' component={ListContainer} />
      </Switch>
    </Router>
  );
};

export default App;
