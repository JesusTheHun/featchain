import {combineReducers} from "redux";
import {createReducer} from "typesafe-actions";
import {fetchAccountDetailsAsync, setAccountCredentials} from "../actions/account";
import { AccountCredentials, AccountDetails } from 'FeatchainTypes';

export type AccountState = Readonly<{
    readonly isLoading: boolean;
    readonly entity: Partial<AccountCredentials & AccountDetails>;
}>

export const initialState: AccountState = {
    isLoading: false,
    entity: {},
};

const reducer = combineReducers({
    isLoading: createReducer(initialState.isLoading)
        .handleAction([fetchAccountDetailsAsync.request], () => true)
        .handleAction([
            fetchAccountDetailsAsync.success,
            fetchAccountDetailsAsync.failure,
        ], () => false),
    entity: createReducer(initialState.entity)
        .handleAction(setAccountCredentials, (state, action) => action.payload)
        .handleAction(fetchAccountDetailsAsync.success, (state, action) => {
            return {
                ...state,
                details: action.payload,
            }
        }),
});

export default reducer;
