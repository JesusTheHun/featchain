import {combineReducers} from "redux";
import issuer from './issuer';
import account from './account';

export default combineReducers({
    issuer,
    account,
});
