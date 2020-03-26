import {IssuerAccount} from "../../../../../blockchain/typings/featchain";
import {APIResponse, APIErrorResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import {createAsyncAction} from "typesafe-actions";
import {CreateFeatTypeActionPayload, CreateIssuerActionPayload} from "FeatchainTypes";

export const fetchIssuerAsync = createAsyncAction(
    'FETCH_ISSUER_REQUEST',
    'FETCH_ISSUER_SUCCESS',
    'FETCH_ISSUER_FAILURE'
)<string, IssuerAccount, APIErrorResponse>();

export const createIssuerAsync = createAsyncAction(
    'CREATE_ISSUER_REQUEST',
    'CREATE_ISSUER_SUCCESS',
    'CREATE_ISSUER_FAILURE'
)<CreateIssuerActionPayload, APIResponse, APIErrorResponse>();

export const createFeatTypeAsync = createAsyncAction(
    'CREATE_FEAT_TYPE_REQUEST',
    'CREATE_FEAT_TYPE_SUCCESS',
    'CREATE_FEAT_TYPE_FAILURE'
)<CreateFeatTypeActionPayload, APIResponse, APIErrorResponse>();
