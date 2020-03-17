import { StateType, ActionType } from 'typesafe-actions';
import { Services } from '../services/types';
import { Epic } from 'redux-observable';

export type Store = StateType<typeof import('./index').default>;
export type RootAction = ActionType<typeof import('../actions').default>;
export type RootState = StateType<ReturnType<typeof import('../reducers').default>>;
export type RootEpic = Epic<RootAction, RootAction, RootState, Services>;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}
