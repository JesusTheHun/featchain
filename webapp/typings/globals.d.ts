declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;

  APP_CONFIG: {
    REACT_APP_FEATCHAIN_BASEURL: string;
    REACT_APP_FEATCHAIN_DEFAULT_ACCOUNT_ADDRESS: string;
    REACT_APP_FEATCHAIN_DEFAULT_ACCOUNT_PASSPHRASE: string;
  }
}

declare interface NodeModule {
  hot?: { accept: (path: string, callback: () => void) => void };
}

declare interface System {
  import<T = any>(module: string): Promise<T>;
}

declare interface Navigator {
  language: string;
}

declare var System: System;
