import { createAsyncAction} from 'typesafe-actions';
import {CreateIssuerPayload, LiskBlockchainError} from "../../../services/featchain/types";
import {IssuerAccount} from "../../../../../blockchain/typings/featchain";

export const fetchIssuerAsync = createAsyncAction(
    'FETCH_ISSUER_REQUEST',
    'FETCH_ISSUER_SUCCESS',
    'FETCH_ISSUER_FAILURE'
)<string, IssuerAccount, LiskBlockchainError>();

export const createIssuerAsync = createAsyncAction(
    'CREATE_ISSUER_REQUEST',
    'CREATE_ISSUER_SUCCESS',
    'CREATE_ISSUER_FAILURE'
)<CreateIssuerPayload, IssuerAccount, LiskBlockchainError>();

export default {
    fetch: fetchIssuerAsync,
    create: createIssuerAsync,
};
