import { Account } from '@liskhq/lisk-transactions';
import { IssuerAccount, PersonAccount } from "../../typings/featchain";

export function isIssuerAccount(account: Account): account is IssuerAccount {
    return "featTypes" in account.asset;
}

export function isPersonAccount(account: Account): account is PersonAccount {
    return "awardsReceived" in account.asset;
}
