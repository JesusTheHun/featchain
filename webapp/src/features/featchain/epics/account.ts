import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {RootEpic} from "FeatchainTypes";
import {faucetAsync, fetchAccountDetailsAsync} from "../actions/account";
import {notification} from "antd";

export const fetchAccountDetailsEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(fetchAccountDetailsAsync.request)),
        switchMap(action =>
            from(featchain.fetchAccountDetails(action.payload)).pipe(
                map(fetchAccountDetailsAsync.success),
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
