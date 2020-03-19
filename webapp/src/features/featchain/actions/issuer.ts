import { createAsyncAction} from 'typesafe-actions';
import {IssuerAccount} from "../../../../../blockchain/typings/featchain";
import {APIResponse} from "@liskhq/lisk-api-client/dist-node/api_types";

export type CreateIssuerActionPayload = {
    passphrase: string;
    title: string;
    description: string;
    authorityUrl: string;
};

export const fetchIssuerAsync = createAsyncAction(
    'FETCH_ISSUER_REQUEST',
    'FETCH_ISSUER_SUCCESS',
    'FETCH_ISSUER_FAILURE'
)<string, IssuerAccount, APIResponse>();

export const createIssuerAsync = createAsyncAction(
    'CREATE_ISSUER_REQUEST',
    'CREATE_ISSUER_SUCCESS',
    'CREATE_ISSUER_FAILURE'
)<CreateIssuerActionPayload, APIResponse, APIResponse>();
