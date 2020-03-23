import {IssuerAccount} from "../../../../../blockchain/typings/featchain";
import {APIResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import {createAsyncAction} from "typesafe-actions";
import {CreateIssuerActionPayload} from "FeatchainTypes";

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
