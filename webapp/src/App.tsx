import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';

import { history } from './store';
import Home from './screens/Home';
import { getPath } from './utils/router-paths';
import './App.scss';

class App extends Component {
  render() {
    return (
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path={getPath('home')} render={() => <Home />} />
            <Route render={() => <div>Page not found!</div>} />
          </Switch>
        </ConnectedRouter>
    );
  }
}

export default App;
