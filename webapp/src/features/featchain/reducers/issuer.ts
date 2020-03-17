import { combineReducers } from 'redux';
import issuerActions from "../actions/issuer";
import {createReducer} from "typesafe-actions";
import {RootState} from "../../../store/types";
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
        .handleAction([issuerActions.fetch.request, issuerActions.create.request], () => true)
        .handleAction([
            issuerActions.fetch.success,
            issuerActions.fetch.failure,
            issuerActions.create.success,
            issuerActions.create.failure,
        ], () => false),
    entity: createReducer(initialState.entity).handleAction(issuerActions.fetch.success, (state: RootState, action: ReturnType<typeof issuerActions.fetch.success>) => action.payload),
});

export default reducer;
