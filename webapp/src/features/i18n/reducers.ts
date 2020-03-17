import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { setLanguage } from './actions';
import {RootState} from "../../store/types";

export type I18nState = Readonly<{
  language: string;
}>

export const initialState: I18nState = {
    language: navigator.language,
};

const reducer = combineReducers({
  language: createReducer(initialState.language).handleAction(setLanguage, (state: RootState, action: ReturnType<typeof setLanguage>) => action.payload),
});

export default reducer;
