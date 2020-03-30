import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {RootEpic} from "FeatchainTypes";

import {APIErrorResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import { fetchTransactionAsync } from '../actions/transaction';
import {CreateFeatTypeTransaction} from "featchain-blockchain";

export const fetchTransactionsEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(fetchTransactionAsync.request)),
        switchMap(action =>
            from(featchain.fetchTransaction<CreateFeatTypeTransaction>(action.payload)).pipe(
                map(fetchTransactionAsync.success),
                catchError((error: APIErrorResponse) => of(fetchTransactionAsync.failure(error)))
            )
        )
    );
};
