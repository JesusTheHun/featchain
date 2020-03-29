import { from, of } from 'rxjs';
import {filter, switchMap, map, catchError, throttleTime, groupBy, mergeMap} from 'rxjs/operators';
import {isActionOf} from 'typesafe-actions';
import {RootEpic} from "FeatchainTypes";
import {faucetAsync, fetchAccountDetailsAsync, fetchAccountDetailsWish} from "../actions/account";
import {notification} from "antd";
import {fetchTransactionAsync} from "../actions/transaction";
import {isPersonAccount} from "featchain-transactions/dist/utils/type-utils";
import {Award} from "featchain-transactions";

export const fetchAccountDetailsWishEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(fetchAccountDetailsWish)),
        groupBy(action => action.payload),
        mergeMap(group$ => group$.pipe(
            throttleTime(3000),
            map(action => fetchAccountDetailsAsync.request(action.payload))
        ))
    );
};

export const fetchAccountDetailsEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(fetchAccountDetailsAsync.request)),
        switchMap(action =>
            from(featchain.fetchAccountDetails(action.payload)).pipe(
                switchMap(accountDetails => {

                    const toDispatch = [];
                    toDispatch.push(fetchAccountDetailsAsync.success(accountDetails));

                    if (isPersonAccount(accountDetails)) {
                        Object.values(accountDetails.asset.awardsReceived).forEach((award: Award) => {
                            toDispatch.push(fetchTransactionAsync.request(award.featTypeId));
                        });
                    }

                    return from(toDispatch);
                }),
                catchError(message => of(fetchAccountDetailsAsync.failure(message)))
            )
        )
    );
};

export const faucetEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(faucetAsync.request)),
        switchMap(action =>
            from(featchain.faucet(action.payload)).pipe(
                map((successPayload) => {

                    notification.success({
                        message: "Faucet",
                        description: "Your account has been abounded, it will be visible in a few seconds",
                        placement: "bottomRight",
                    });

                    return faucetAsync.success(successPayload);
                }),
                catchError(error => {

                    notification.error({
                        message: "API error",
                        description: error.message,
                        placement: "bottomRight",
                    });

                    return of(faucetAsync.failure(error))
                })
            )
        )
    );
};
