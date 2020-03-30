import {IssuerAccount, PersonAccount} from "featchain-blockchain";

declare module "FeatchainTypes" {
    export type AccountCredentials = {
        passphrase: string;
        publicKey: string;
        address: string;
    }

    export type AccountDetails = PersonAccount | IssuerAccount;
}
