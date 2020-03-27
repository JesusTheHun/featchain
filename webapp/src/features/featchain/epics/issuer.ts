import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {RootEpic} from "FeatchainTypes";
import {awardFeatAsync, createFeatTypeAsync, createIssuerAsync} from "../actions/issuer";
import { notification } from 'antd';
import {APIErrorResponse} from "@liskhq/lisk-api-client/dist-node/api_types";

export const createIssuerEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(createIssuerAsync.request)),
        switchMap(action =>
            from(featchain.createIssuer(action.payload)).pipe(
                map((payload) => {

                    notification.success({
                        message: "Success",
                        description: "Your account has been converted, it will be visible in a few moment",
                        placement: "bottomRight",
                    });

                    return createIssuerAsync.success(payload);
                }),
                catchError((error: APIErrorResponse) => {

                    notification.error({
                        message: "API error",
                        description: error.message,
                        placement: "bottomRight",
                    });

                    return of(createIssuerAsync.failure(error))
                })
            )
        )
    );
};

export const createFeatTypeEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(createFeatTypeAsync.request)),
        switchMap(action =>
            from(featchain.createFeatType(action.payload)).pipe(
                map((payload) => {

                    notification.success({
                        message: "Success",
                        description: "The feat type has been created, it will be visible in a few moment",
                        placement: "bottomRight",
                    });

                    return createFeatTypeAsync.success(payload);
                }),
                catchError((error: APIErrorResponse) => {

                    notification.error({
                        message: "API error",
                        description: error.message,
                        placement: "bottomRight",
                    });

                    return of(createFeatTypeAsync.failure(error))
                })
            )
        )
    );
};

export const awardFeatEpic: RootEpic = (action$, state$, { featchain }) => {
    return action$.pipe(
        filter(isActionOf(awardFeatAsync.request)),
        switchMap(action =>
            from(featchain.awardFeat(action.payload)).pipe(
                map((payload) => {

                    notification.success({
                        message: "Success",
                        description: "The feat has been awarded, it will be visible on their account in a few moments",
                        placement: "bottomRight",
                    });

                    return awardFeatAsync.success(payload);
                }),
                catchError((error: APIErrorResponse) => {

                    notification.error({
                        message: "API error",
                        description: error.message,
                        placement: "bottomRight",
                    });

                    return of(awardFeatAsync.failure(error))
                })
            )
        )
    );
};
