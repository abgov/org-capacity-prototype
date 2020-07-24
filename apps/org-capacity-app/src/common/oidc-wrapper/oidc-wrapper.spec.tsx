/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import createStore from 'redux-mock-store';

import { OidcWrapper } from './oidc-wrapper.component';

describe('OidcWrapper', () => {
  const mockStore = createStore();

  it('should render successfully', () => {
    const store = mockStore({});

    const { baseElement } = render(
      <BrowserRouter>
        <OidcWrapper 
          callbackPath="/callback" 
          redirectPath="/" 
          userManager={{events: {
            load: () => {},
            unload: () => {},
            addUserLoaded: () => {},
            addSilentRenewError: () => {},
            addAccessTokenExpired: () => {},
            addAccessTokenExpiring: () => {},
            addUserUnloaded: () => {},
            addUserSignedOut: () => {},
            addUserSessionChanged: () => {},
            removeUserLoaded: () => {},
            removeSilentRenewError: () => {},
            removeAccessTokenExpired: () => {},
            removeUserUnloaded: () => {}, 
            removeUserSignedOut: () => {}, 
            removeUserSessionChanged: () => {}, 
            removeAccessTokenExpiring: () => {}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }} as any} 
          store={store} 
          onLoginCallback={() => {
            // do nothing.
          }}
        />
      </BrowserRouter>);
    expect(baseElement).toBeTruthy();
  });
});
