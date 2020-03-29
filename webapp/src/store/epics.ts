import { combineEpics } from 'redux-observable';
import {issuer, account, transaction} from "../features/featchain/epics";

export default combineEpics(
    ...Object.values(account),
    ...Object.values(issuer),
    ...Object.values(transaction),
);
