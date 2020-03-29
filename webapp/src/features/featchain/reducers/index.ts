import {combineReducers} from "redux";
import issuer from './issuer';
import account from './account';
import transaction from "./transaction";

export default combineReducers({
    issuer,
    account,
    transaction,
});
