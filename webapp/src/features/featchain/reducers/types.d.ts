import {IssuerAccount, PersonAccount} from "../../../../../blockchain/typings/featchain";

declare module "FeatchainTypes" {
    export type AccountCredentials = {
        passphrase: string;
        publicKey: string;
        address: string;
    }

    export type AccountDetails = PersonAccount | IssuerAccount;
}
