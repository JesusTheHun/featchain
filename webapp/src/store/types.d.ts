import { StateType, ActionType } from 'typesafe-actions';
import { Epic } from 'redux-observable';

declare module 'FeatchainTypes' {
  export type Store = StateType<typeof import('./index').default>;
  export type RootAction = ActionType<typeof import('./actions').default>;
  export type RootState = StateType<ReturnType<typeof import('./reducers').default>>;
  export type RootEpic = Epic<RootAction, RootAction, RootState, Services>;
}

declare module 'typesafe-actions' {
  interface Types {
    RootAction: ActionType<typeof import('./actions').default>;
  }
}
