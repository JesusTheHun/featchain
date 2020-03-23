import {} from 'typesafe-actions';

declare module 'FeatchainTypes' {
    export type Services = typeof import('./index').default;
}
