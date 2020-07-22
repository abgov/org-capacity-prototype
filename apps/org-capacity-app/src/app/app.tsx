import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { UserRole } from '@org-capacity/org-capacity-common';
import { AppState, UserProfile } from '../types';
import { AppHeader } from './app-header/app-header';
import AppSideNav from './app-side-nav/app-side-nav';
import { SignIn } from './sign-in/sign-in';
import OrganizationStructure from './organization-structure/organization-structure';
import OrganizationCapacity from './organization-capacity/organization-capacity';
import OrganizationDetails from './organization-details/organization-details';

const useStyles = makeStyles(theme => ({
  app: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
    display: 'flex',
    background: '#f1f1f1',
    '& > header': {
      zIndex: theme.zIndex.drawer + 1,
    },
    '& > main': {
      flexGrow: 1,
      position: 'relative'
    }
  },
  toolbar: theme.mixins.toolbar,
  content: {
    padding: theme.spacing(2)
  }
}));

interface AppProps {
  user: UserProfile
  roles: UserRole[]
}

export const App = (
  {user, roles}: AppProps
) => {

  const classes = useStyles({});

  return (
    <div className={classes.app}>
      <AppHeader>
      </AppHeader>
      <Switch>
        <Route path="/signin" render={() => 
          <main>
            <div className={classes.toolbar} />
            <SignIn 
              description="Sign in to view organization capacity and update the status of your area." 
            />
          </main>
        } />
        <Route render={() =>
          <React.Fragment>
            <AppSideNav />
            <main>
              <div className={classes.toolbar} />
              <div className={classes.content}>
                <Switch>
                  <Route path="/organization/:area/details" exact component={OrganizationDetails} />
                  <Route path="/organization/:area" exact component={OrganizationCapacity} />
                  <Route path="/organization" component={OrganizationStructure} />
                  
                  <Redirect to="/organization" />
                </Switch>
              </div>
            </main>
          </React.Fragment>
        } />
      </Switch>
    </div>
  );
};

export default connect(
  (state: AppState) => ({
    user: state.user.profile,
    roles: state.user.roles
  })
)(App);
