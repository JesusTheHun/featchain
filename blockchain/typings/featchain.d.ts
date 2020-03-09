import { Account } from '@liskhq/lisk-transactions';

export interface IssuerAccount extends Account {
    asset: IssuerAsset | object;
    balance: string;
}

export interface IssuerAsset {
    title: string;
    description: string;
    authorityUrl?: string;
    featTypes: {
        [id: string]: FeatTypeAsset;
    }
}

export interface CreateIssuerTransactionAsset {
    title: string;
    description: string;
    authorityUrl?: string;
    amount: bigint;
}

export interface FeatTypeAsset {
    id: string;
    title: string;
    description: string;
    awarded: bigint;
}

export interface CreateFeatTypeTransactionAsset {
    id: string;
    title: string;
    description: string;
    amount: bigint;
}
