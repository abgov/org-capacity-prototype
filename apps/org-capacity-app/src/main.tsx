/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createUserManager } from 'redux-oidc';
import { createMuiTheme, responsiveFontSizes, MuiThemeProvider } from '@material-ui/core';
import { OidcWrapper } from './common';
import { getEnvironment } from './environments';

import App from './app/app';
import { createAppStateStore } from './state';

  getEnvironment().then((environment) => {

  const history = createBrowserHistory();
  const {AUTH_CLIENT_ID, AUTH_URL} = environment;

  const userManager = createUserManager({
    client_id: AUTH_CLIENT_ID,
    redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/auth/callback`,
    response_type: 'code',
    authority: AUTH_URL,
    automaticSilentRenew: true,
    extraQueryParams: {
      kc_idp_hint: 'google'
    }
  });

  const store = createAppStateStore(environment, history, userManager);

  let theme = createMuiTheme({
    palette: {
      primary: { main: '#0070C4' }
    },
    typography: {
      fontFamily: "'acumin-pro-semi-condensed', sans-serif"
    }
  });

  theme = responsiveFontSizes(theme);

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <OidcWrapper userManager={userManager} store={store} 
            callbackPath="/auth/callback" redirectPath="/">
            <App />
          </OidcWrapper>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
});
