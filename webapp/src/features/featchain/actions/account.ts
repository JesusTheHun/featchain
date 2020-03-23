import {createAsyncAction, createAction} from "typesafe-actions";
import {APIResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import { AccountDetails, AccountCredentials } from 'FeatchainTypes';

export const fetchAccountDetailsAsync = createAsyncAction(
    'FETCH_ACCOUNT_REQUEST',
    'FETCH_ACCOUNT_SUCCESS',
    'FETCH_ACCOUNT_FAILURE'
)<string, AccountDetails, APIResponse>();

export const setAccountCredentials = createAction('SET_ACCOUNT')<AccountCredentials>();
