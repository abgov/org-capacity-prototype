import { History } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { loadUser } from 'redux-oidc';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import { UserManager } from 'oidc-client';
import { Environment } from '../environments';
import createAppReducer from './reducers';
import { createAppEpic } from './epics';
import { loadAvailabilityStatusTypes } from './actions';

const epicMiddleware = createEpicMiddleware();

export const createAppStateStore = (
  environment: Environment,
  history: History, 
  userManager: UserManager
) => {
    
  const store = createStore(
    createAppReducer(history), 
    composeWithDevTools(
      applyMiddleware(thunk, epicMiddleware, routerMiddleware(history))
    )
  );

  const appEpic = createAppEpic(environment, userManager);
  epicMiddleware.run(appEpic);
  
  loadUser(store, userManager);
  store.dispatch(loadAvailabilityStatusTypes());

  return store;
}

export * from './actions';