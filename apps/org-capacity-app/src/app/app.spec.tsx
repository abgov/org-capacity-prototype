import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import createStore from 'redux-mock-store';

import App from './app';

describe('App', () => {
  const mockStore = createStore();

  it('should render successfully', () => {
    const state = {
      user: {
        profile: null,
        roles: [],
        token: null
      },
      busy: {},
      router: { 
        location: null,
        action: null 
      },
      organization: {
        results: [],
        organizations: {},
        organizationId: null,
        modified: null,
        modifiedRoles: null
      }
    }
    const store = mockStore(state);
    
    const { baseElement } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(baseElement).toBeTruthy();
  });
});
