import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createBrowserHistory } from 'history';
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router';

import { composeEnhancers } from './utils';
import createRootReducer from './reducers';
import services from '../services';
import { RootAction, RootState, Services } from 'FeatchainTypes';
import rootEpic from './epics';

export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Services
  >({
  dependencies: services,
});

export const history = createBrowserHistory();
const middlewares = [createRouterMiddleware(history), epicMiddleware];
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(createRootReducer(history), enhancer);

epicMiddleware.run(rootEpic);

export default store;
