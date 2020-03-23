import {CreateIssuerTransactionAsset} from "../../../../blockchain/typings/featchain";

declare module 'FeatchainTypes' {
    export type CreateIssuerPayload = {
        networkIdentifier: string;
        timestamp: number;
        asset: CreateIssuerTransactionAsset;
    }
}
