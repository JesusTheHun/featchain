import { combineEpics } from 'redux-observable';
import {issuer} from "../features/featchain/epics";

export default combineEpics(
    ...Object.values(issuer),
);
