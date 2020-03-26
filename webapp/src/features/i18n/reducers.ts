import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { setLanguage } from './actions';

export type I18nState = Readonly<{
  language: string;
}>

export const initialState: I18nState = {
    language: navigator.language,
};

export default  combineReducers({
  language: createReducer(initialState.language)
      .handleAction(setLanguage, (state, action) => action.payload),
});
