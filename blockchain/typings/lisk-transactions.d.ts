import '@liskhq/lisk-transactions';

declare module '@liskhq/lisk-transactions' {

    interface Account {
        asset: object;
    }
}
