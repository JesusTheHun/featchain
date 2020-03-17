import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { History } from 'history';
import i18n from '../features/i18n/reducers';
import featchain from '../features/featchain/reducers';

const rootReducer = (history: History<any>) =>combineReducers({
    router: connectRouter(history),
    i18n,
    featchain,
});

export default rootReducer;
