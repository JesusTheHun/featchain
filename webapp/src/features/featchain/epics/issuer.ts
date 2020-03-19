import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {RootEpic} from "FeatchainTypes";
import {createIssuerAsync} from "../actions/issuer";

export const createArticlesEpic: RootEpic = (action$, state$, { featchain }) =>
    action$.pipe(
        filter(isActionOf(createIssuerAsync.request)),
        switchMap(action =>
            from(featchain.createIssuer(action.payload)).pipe(
                map(createIssuerAsync.success),
                catchError(message => of(createIssuerAsync.failure(message)))
            )
        )
    );
