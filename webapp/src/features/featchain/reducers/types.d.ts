import {IssuerAccount, PersonAccount} from "featchain-transactions";

declare module "FeatchainTypes" {
    export type AccountCredentials = {
        passphrase: string;
        publicKey: string;
        address: string;
    }

    export type AccountDetails = PersonAccount | IssuerAccount;
}
