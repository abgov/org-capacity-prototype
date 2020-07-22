import React, { useState } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { OpenInBrowser, Edit } from '@material-ui/icons';
import { makeStyles, CardHeader, CardContent, CardActions, IconButton, Collapse } from '@material-ui/core';
import { Organization, AppState } from '../../types';
import { Card, CardActionBar, ExpandButton } from '../../common';

interface OrganizationProps {
  organization: Organization,
  children: Organization[],
  onLoadChildren: (parentId: string) => void
  onView: (orgId: string) => void
  onEdit: (orgId: string) => void
}

const useStyles = makeStyles((theme) => ({
  children: {
    paddingLeft: theme.spacing(2),
    '& > div > div > *': {
      paddingTop: theme.spacing(2)
    }
  }
}));

const OrganizationComponent = ({organization, children, onLoadChildren, onView, onEdit}: OrganizationProps) => {
  
  const classes = useStyles({});
  const [childrenExpanded, setChildrenExpanded] = useState(false);
  
  return (
    <div>
      <Card>
        <CardHeader title={organization.name} 
          action={onView ? <IconButton onClick={() => onView(organization.id)}><OpenInBrowser /></IconButton> : null}
        />
        <CardContent>
          
        </CardContent>
        <CardActions>
          {
            (organization.children && 
            organization.children.length) ?
            <ExpandButton expanded={childrenExpanded} direction="right"
              onClick={() => {
                setChildrenExpanded(!childrenExpanded);
                if (!children.length ||
                  children.length !== organization.children.length) {
                  onLoadChildren(organization.id)
                }
              }}/> : null
          }
          <div  style={{marginLeft: 'auto'}} />
          <CardActionBar>
          { onEdit && <IconButton onClick={() => onEdit(organization.id)}><Edit /></IconButton> }
          </CardActionBar>
        </CardActions>
      </Card>
      <Collapse className={classes.children} in={childrenExpanded}>
      {
        children &&
        children.map(child => 
          <OrganizationContainer 
            key={child.id} 
            organization={child} 
            onLoadChildren={onLoadChildren} 
          />)
      }
      </Collapse>
    </div>
  )
}

export const OrganizationContainer = connect(
  (state: AppState) => ({
    getChildren: (org) => org && org.children ?
      org.children.map(
        c => state.organization.organizations[c.id]
      ).filter(c => c) : 
      []
  }),
  (dispatch) => ({
    onView: (id: string) => dispatch(push(`/organization/${id}`)),
    onEdit: (id: string) => dispatch(push(`/organization/${id}/details`))
  }),
  (stateProps, dispatchProps, ownProps: {organization: Organization}) => ({
    ...ownProps,
    ...dispatchProps,
    children: stateProps.getChildren(ownProps.organization)
  })
)(OrganizationComponent);

export default OrganizationContainer;
