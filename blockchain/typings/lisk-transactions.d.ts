import '@liskhq/lisk-transactions';
import {TransactionJSON} from "@liskhq/lisk-transactions/dist-node/transaction_types";
import {AccountFilter} from "./filters.account";
import {TransactionFilter} from "./filters.transaction";

declare module '@liskhq/lisk-transactions' {

    interface Account {
        asset: object;
    }

    interface StateStoreCache<T> {
        cache(filterArray: ReadonlyArray<AccountFilter | TransactionFilter>): Promise<ReadonlyArray<T>>;
    }
}
