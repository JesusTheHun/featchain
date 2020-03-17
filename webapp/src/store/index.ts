import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createBrowserHistory } from 'history';
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router';

import { composeEnhancers } from './utils';
import createRootReducer from './reducers';
import services from '../services';
import { RootAction, RootState } from './types';
import { Services } from '../services/types';
import rootEpic from './epics';

// browser history
export const history = createBrowserHistory();

export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Services
  >({
  dependencies: services,
});

const routerMiddleware = createRouterMiddleware(history);

// configure middlewares
const middlewares = [epicMiddleware, routerMiddleware];
// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// create store
const store: RootState = createStore(createRootReducer(history), enhancer);

epicMiddleware.run(rootEpic);

// export store singleton instance
export default store;
