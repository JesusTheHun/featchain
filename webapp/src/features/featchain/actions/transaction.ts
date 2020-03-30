import {createAsyncAction} from "typesafe-actions";
import {APIErrorResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import {CreateFeatTypeTransaction} from "featchain-blockchain";

export const fetchTransactionAsync = createAsyncAction(
    'FETCH_TRANSACTION_REQUEST',
    'FETCH_TRANSACTION_SUCCESS',
    'FETCH_TRANSACTION_FAILURE'
)<string, CreateFeatTypeTransaction, APIErrorResponse>();
