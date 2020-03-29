import {
    CreateIssuerTransactionAsset,
    CreateFeatTypeTransactionAsset,
    AwardFeatTransactionAsset,
    FeatTypeId, Address
} from "featchain-transactions";
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
        amount: string;
    }

    export type AwardFeatPayload = {
        passphrase: string;
        featTypeId: FeatTypeId;
        addresses: Address[];
        date: number;
        comment: string;
        amount: string;
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
    export type AwardFeatTransactionPayload = LiskTransactionPayload<AwardFeatTransactionAsset>
}
