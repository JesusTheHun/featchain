import { combineReducers } from 'redux';
import {ActionType, createReducer} from 'typesafe-actions';
import actions, { setLanguage } from './actions';

export type I18nState = Readonly<{
  language: string;
}>

export const initialState: I18nState = {
    language: navigator.language,
};

const reducer = combineReducers<I18nState, ActionType<typeof actions>>({
  language: createReducer(initialState.language)
      .handleAction(setLanguage, (state, action) => action.payload),
});

export default reducer;
