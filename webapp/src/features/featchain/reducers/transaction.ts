import {combineReducers} from "redux";
import {createReducer} from "typesafe-actions";
import {fetchTransactionAsync} from "../actions/transaction";

export type TransactionState = Readonly<{
    readonly isLoading: boolean;
    readonly entities: {
        [key: string]: object;
    };
}>

export const initialState: TransactionState = {
    isLoading: false,
    entities: {},
};

export default combineReducers({
    isLoading: createReducer(initialState.isLoading)
        .handleAction(fetchTransactionAsync.request, () => true)
        .handleAction([
            fetchTransactionAsync.success,
            fetchTransactionAsync.failure,
        ], () => false),
    entities: createReducer(initialState.entities)
        // @ts-ignore
        .handleAction(fetchTransactionAsync.success, (state, action) => {
            return {
                ...state,
                [action.payload.id]: action.payload,
            }
        })
});
