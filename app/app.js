/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
// Import root app
import App from 'containers/App';
import { API_VERSION_CONFIG, VERSION_NO, DEV } from '../app/config/urlConfig'
// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./assets/js/appConfig.js';
import '!file-loader?name=[name].[ext]!./firebase-messaging-sw.js';
import '!file-loader?name=[name].[ext]!../css/api.js';
// import '!file-loader?name=[name].[ext]!../css/diagram.bpmn';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';
import './assets/scss/custom-boostrap.css';

// Import i18n messages
import { translationMessages } from './i18n';

const theme = createMuiTheme({
  direction: 'ltr',
  palette: {
    primary: {
      light: '#61c5ff',
      main: '#2196F3',
      dark: '#0067a9',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    success: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    action: {
      // selected: '#00ACC1',
      // hover: '#00ACC1',
      // disabled: '#9B9B9B',
    },
  },
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true,
  },
  spacing: 4,
  overrides: {
    MuiCard: {
      root: {
        overflow: 'visible',
      },
    },
    MuiTableRow: {
      root: {
        '&:hover': {
          boxShadow: '-2px 2px 2px -2px gray',
          background: '#F5F5F5',
        },
      },
    },
    // TableContainer: {
    //   root: {
    //     height: 600,
    //   },
    // },
    // check
    Pager: {
      pager: {
        padding: 0,
      },
    },
    TableCell: {
      cell: {
        '&:first-child': {
          // paddingLeft: '0 !important',
        },
      },
    },
    SortLabel: {
      root: {
        marginTop: 5,
      },
    },
  },
});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
const container = document.getElementById('tryit-jssip-container');
const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <SnackbarProvider>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <MuiThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <App />
              </MuiPickersUtilsProvider>
            </MuiThemeProvider>
          </ConnectedRouter>
        </LanguageProvider>
      </SnackbarProvider>
    </Provider>,
    MOUNT_NODE,
    container,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}
// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}
if (true) {
  fetch(API_VERSION_CONFIG)
    .then(response => response.json())
    .then((data) => {
      if ((VERSION_NO < data.versionConfig) && !DEV) {
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach(name => {
              caches.delete(name);
            })
          });
          window.location.reload(true);
        }
      }
      else { }
    }).catch()
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
