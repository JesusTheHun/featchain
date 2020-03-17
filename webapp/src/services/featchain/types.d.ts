import {CreateIssuerTransactionAsset} from "../../../../blockchain/typings/featchain";

export type CreateIssuerPayload = {
    networkIdentifier: string,
    timestamp: number,
    asset: CreateIssuerTransactionAsset
}

export type LiskBlockchainError = {
    message: string;
}
