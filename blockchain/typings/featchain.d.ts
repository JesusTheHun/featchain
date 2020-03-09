import { Account } from '@liskhq/lisk-transactions';

export type TxId = string;
export type FeatTypeId = string;
export type Address = string;

export interface IssuerAccount extends Account {
    asset: IssuerAsset;
    balance: string;
}

export interface IssuerAsset {
    title: string;
    description: string;
    authorityUrl?: string;
    featTypes: {
        [id: string]: FeatType;
    }
}

export interface FeatType {
    id: FeatTypeId;
    title: string;
    description: string;
    awardCount: bigint;
}

export interface PersonAccount extends Account {
    asset: PersonAsset;
    balance: string;
}

export interface PersonAsset {
    awardsReceived: { [key in TxId]: Award};
}

/**
 * @property date UTC Timestamp, not blockchain EPOCH, it's a business date not a technical one
 */
export interface Award {
    featTypeId: FeatTypeId;
    date: number;
    comment: string;
}

export interface CreateIssuerTransactionAsset {
    title: string;
    description: string;
    authorityUrl?: string;
    amount: bigint;
}

export interface CreateFeatTypeTransactionAsset {
    id: string;
    title: string;
    description: string;
    amount: bigint;
}

export interface AwardFeatTransactionAsset {
    featTypeId: FeatTypeId;
    addresses: Array<Address>;
    date: number;
    comment: string;
    amount: bigint;
}
