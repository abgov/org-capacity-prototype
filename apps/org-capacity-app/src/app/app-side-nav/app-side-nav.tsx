import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import clsx from 'clsx';
import { Home, Business } from '@material-ui/icons';
import { 
  makeStyles, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Fade 
} from '@material-ui/core';
import { AppState, Organization } from '../../types';
import AppNavOrganizationItem from '../app-nav-organization-item/app-nav-organization-item';

interface AppSideNavProps {
  organizations: Organization[]
  userOrgId: string
  onClickHome: (userOrgId: string) => void
}

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(8),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8),
    },
  },
  drawerContent: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  org: {
    padding: 0
  },
  orgHeading: {
    margin: 0
  }
}));

const AppSideNav = ({organizations, userOrgId, onClickHome}: AppSideNavProps) => {
  
  const classes = useStyles({});

  const [expanded, setExpanded] = useState(false);
  
  return (
    <Drawer 
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: expanded,
        [classes.drawerClose]: !expanded,
      })} 
      variant="permanent"
      classes={{
        paper: clsx({
          [classes.drawerOpen]: expanded,
          [classes.drawerClose]: !expanded,
        })
      }}>
      <div className={classes.drawerContent}>
        <div className={classes.toolbar} />
        {
          userOrgId &&
          <React.Fragment>
            <List>
              <ListItem button onClick={() => onClickHome(userOrgId)}>
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary="My Area" />
              </ListItem>
            </List>
            <Divider />
          </React.Fragment>
        }
        <List>
          <ListItem button className={classes.orgHeading}
            onClick={() => setExpanded(!expanded)}>
            <ListItemIcon><Business /></ListItemIcon>
            <ListItemText primary="Organization" />
          </ListItem>
        </List>
        <Fade in={expanded}>
          <List dense className={classes.org}>
            {
              organizations.map(org => 
                <AppNavOrganizationItem key={org.id} level={1} organization={org} />)
            }
          </List>
        </Fade>
      </div>
    </Drawer>
  )
}

const organizationsSelector = createSelector(
  (state: AppState) => state.organization.results,
  (state: AppState) => state.organization.organizations,
  (results, orgs) => results.map(r => orgs[r])
)

const userOrgIdSelector = createSelector(
  (state: AppState) => state.user.token,
  (state: AppState) => state.user.profile,
  (token, profile) => (token && profile) ? profile.organizationId: null
)

export default connect(
  (state: AppState) => ({
    userOrgId: userOrgIdSelector(state),
    organizations: organizationsSelector(state)
  }),
  (dispatch) => ({
    onClickHome: (orgId: string) => dispatch(push(`/organization/${orgId}/details`))
  })
)(AppSideNav);
