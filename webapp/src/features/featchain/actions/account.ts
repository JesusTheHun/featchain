import {createAsyncAction, createAction} from "typesafe-actions";
import {APIErrorResponse, APIResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import {AccountDetails, AccountCredentials, FaucetActionPayload} from 'FeatchainTypes';

export const faucetAsync = createAsyncAction(
    'FAUCET_REQUEST',
    'FAUCET_SUCCESS',
    'FAUCET_FAILURE'
)<FaucetActionPayload, APIResponse, APIErrorResponse>();

export const fetchAccountDetailsAsync = createAsyncAction(
    'FETCH_ACCOUNT_REQUEST',
    'FETCH_ACCOUNT_SUCCESS',
    'FETCH_ACCOUNT_FAILURE'
)<string, AccountDetails, APIErrorResponse>();

export const setAccountCredentials = createAction('SET_ACCOUNT')<AccountCredentials>();
export const deleteAccountCredentials = createAction('DELETE_ACCOUNT')();
