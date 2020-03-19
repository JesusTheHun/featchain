import { combineReducers } from 'redux';
import {createIssuerAsync, fetchIssuerAsync} from "../actions/issuer";
import {createReducer} from "typesafe-actions";
import {RootState} from "FeatchainTypes";
import {IssuerAccount} from "../../../../../blockchain/typings/featchain";

export type IssuerState = Readonly<{
    readonly isLoading: boolean;
    readonly entity: IssuerAccount;
}>

export const initialState: IssuerState = {
    isLoading: false,
    entity: {} as IssuerAccount,
};

const reducer = combineReducers({
    isLoading: createReducer(initialState.isLoading)
        .handleAction([fetchIssuerAsync.request, createIssuerAsync.request], () => true)
        .handleAction([
            fetchIssuerAsync.success,
            fetchIssuerAsync.failure,
            createIssuerAsync.success,
            createIssuerAsync.failure,
        ], () => false),
    entity: createReducer(initialState.entity)
        .handleAction(fetchIssuerAsync.success, (state: RootState, action: ReturnType<typeof fetchIssuerAsync.success>) => action.payload),
});

export default reducer;
