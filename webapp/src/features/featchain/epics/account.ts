import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {RootEpic} from "FeatchainTypes";
import {fetchAccountDetailsAsync} from "../actions/account";

export const fetchAccountDetailsEpic: RootEpic = (action$, state$, { featchain }) =>
    action$.pipe(
        filter(isActionOf(fetchAccountDetailsAsync.request)),
        switchMap(action =>
            from(featchain.fetchAccountDetails(action.payload)).pipe(
                map(fetchAccountDetailsAsync.success),
                catchError(message => of(fetchAccountDetailsAsync.failure(message)))
            )
        )
    );
