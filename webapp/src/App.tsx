import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';

import { history } from './store';
import Home from './screens/Home';
import Http404 from './screens/Http404';
import { getPath } from './utils/router-paths';
import './App.scss';

import CreateAccount from "./screens/CreateAccount";
import SignIn from "./screens/SignIn";
import Account from "./screens/Account";
import BecomeAuthority from "./screens/BecomeAuthority";
import CreateFeatType from "./screens/CreateFeatType";

class App extends Component {
  render() {
    return (
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path={getPath('home')} render={() => <Home />} />
            <Route exact path={getPath('createAccount')} render={() => <CreateAccount />} />
            <Route exact path={getPath('signIn')} render={() => <SignIn />} />
            <Route exact path={getPath('becomeAuthority')} render={() => <BecomeAuthority />} />
            <Route exact path={getPath('createFeatType')} render={() => <CreateFeatType />} />
            <Route exact path={getPath('account')} render={() => <Account />} />
            <Route render={() => <Http404/>} />
          </Switch>
        </ConnectedRouter>
    );
  }
}

export default App;
