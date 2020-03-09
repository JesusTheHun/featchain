import '@liskhq/lisk-transactions';
import {TransactionJSON} from "@liskhq/lisk-transactions/dist-node/transaction_types";

declare module '@liskhq/lisk-transactions' {

    interface Account {
        asset: object;
    }
}
