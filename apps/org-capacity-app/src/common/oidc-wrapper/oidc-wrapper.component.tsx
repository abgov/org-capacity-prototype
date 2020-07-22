import React from 'react';
import { Store } from 'redux';
import { Route } from 'react-router-dom';
import { UserManager } from 'oidc-client';
import { OidcProvider, CallbackComponent } from 'redux-oidc';
import { makeStyles } from '@material-ui/core';

export interface OidcWrapperProps {
  children?: React.ReactNode
  callbackPath: string
  userManager: UserManager
  store: Store
  redirectPath: string
  onLoginCallback: (err?: Error) => void
}

const useStyles = makeStyles((theme) => ({
  overlay: {
    zIndex: 2,
    position: 'fixed',
    background: '#11111199',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

export const OidcWrapper = (
  {userManager, store, callbackPath, onLoginCallback, children}: OidcWrapperProps
) => {
  
  const classes = useStyles({});
  
  return (
    <OidcProvider userManager={userManager} store={store}>
      <React.Fragment>
        <Route path={callbackPath} render={() => 
          <CallbackComponent userManager={userManager} 
            successCallback={() => onLoginCallback()} 
            errorCallback={(err) => onLoginCallback(err)}>
            <div className={classes.overlay}>
            </div>
          </CallbackComponent>
        } />
        {children}
      </React.Fragment>
    </OidcProvider>
  );
};
