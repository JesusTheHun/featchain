import { combineEpics } from 'redux-observable';
import {issuer, account} from "../features/featchain/epics";

export default combineEpics(
    ...Object.values(account),
    ...Object.values(issuer),
);
