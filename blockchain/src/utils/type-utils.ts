import { Account } from '@liskhq/lisk-transactions';
import { IssuerAccount, PersonAccount } from "../../typings/featchain";

export function isIssuerAccount(account: Account): account is IssuerAccount {
    if (typeof account !== 'object') return false;
    if (typeof account.asset !== 'object') return false;
    return "featTypes" in account.asset;
}

export function isPersonAccount(account: Account): account is PersonAccount {
    if (typeof account !== 'object') return false;
    if (typeof account.asset !== 'object') return false;
    return "awardsReceived" in account.asset;
}
