// tslint:disable-next-line:no-import-side-effect
import 'tslib';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fr';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fr';

import antdLocaleEnUS from 'antd/es/locale/en_US';
import antdLocaleFrFr from 'antd/es/locale/fr_FR';

import moment from 'moment';

import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import { Locale } from 'antd/es/locale-provider';
import store from './store';
import { Provider } from 'react-redux';

const language = navigator.language;
const languageToAntData = new Map<string, Locale>([
  ['en', antdLocaleEnUS],
  ['fr', antdLocaleFrFr],
]);

moment.locale(language);

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={languageToAntData.get(store.getState().i18n.language)}>
      <IntlProvider locale={store.getState().i18n.language} messages={{}}>
        <App />
      </IntlProvider>
    </ConfigProvider>
  </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
