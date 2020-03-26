import {CreateIssuerTransactionAsset, CreateFeatTypeTransactionAsset} from "../../../../blockchain/typings/featchain";
import {FaucetTransactionAsset} from "lisk-transaction-faucet";

declare module 'FeatchainTypes' {
    export type CreateIssuerPayload = {
        passphrase: string;
        title: string;
        description: string;
        authorityUrl: string;
    }

    export type CreateFeatTypePayload = {
        passphrase: string;
        title: string;
        description: string;
    }

    export type FaucetPayload = {
        passphrase: string;
        amount: string;
        address: string;
    }

    type LiskTransactionPayload<Asset> = {
        networkIdentifier: string;
        timestamp: number;
        asset: Asset;
    }

    export type CreateIssuerTransactionPayload = LiskTransactionPayload<CreateIssuerTransactionAsset>
    export type FaucetTransactionPayload = LiskTransactionPayload<FaucetTransactionAsset>
    export type CreateFeatTypeTransactionPayload = LiskTransactionPayload<CreateFeatTypeTransactionAsset>
}
