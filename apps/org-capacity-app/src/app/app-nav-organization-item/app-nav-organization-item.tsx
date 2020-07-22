import React, { useState } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { 
  makeStyles, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse 
} from '@material-ui/core';
import { AppState, Organization } from '../../types';
import { loadOrganizations } from '../../state';
import { ExpandButton } from '../../common';

interface AppNavOrganizationItemProps {
  level: number
  selected: boolean
  organization: Organization
  children: Organization[]
  onLoadChildren: (parentId: string) => void
  onSelectItem: (orgId: string) => void
}

const useStyles = makeStyles((theme) => ({
  item: {
    padding: 0,
    paddingRight: theme.spacing(2),
    paddingLeft: ({level}: AppNavOrganizationItemProps) => 10 * level,
    margin: 0,
    minHeight: 40,
    '&:hover': {
      background: '#f1f1f1'
    },
    '&[data-selected=true]': {
      background: '#f1f1f1'
    }
  },
  org: {
    cursor: 'pointer'
  },
  children: {
    padding: 0
  }
}))

const AppNavOrganizationItemComponent = ({
  level, 
  selected,
  organization, 
  children, 
  onLoadChildren, 
  onSelectItem
}: AppNavOrganizationItemProps) => {
  
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles({level, selected});

  return (
    <React.Fragment>
      <ListItem className={classes.item} data-selected={selected}>
        <ListItemIcon>
          {
            organization.children.length ?
            <ExpandButton direction="right" expanded={expanded} 
              onClick={() => {
                setExpanded(!expanded);
                if (!children.length ||
                  children.length !== organization.children.length) {
                  onLoadChildren(organization.id)
                }
              }} /> : null
          }
        </ListItemIcon>
        <ListItemText className={classes.org}
          primary={organization.name} 
          onClick={() => onSelectItem(organization.id)} />
      </ListItem>
      {
        children &&
        <Collapse in={expanded}>
          <List dense className={classes.children}>
          {
            children.map(child =>
              <AppNavOrganizationItem key={child.id} level={level + 1} organization={child} />)
          }
          </List>
        </Collapse>
      }
    </React.Fragment>
  )
}

export const AppNavOrganizationItem = connect(
  (state: AppState) => ({
    selected: state.organization.organizationId,
    getChildren: (org: Organization) => org && org.children ?
      org.children.map(
        c => state.organization.organizations[c.id]
      ).filter(c => c) : 
      []
  }),
  (dispatch) => ({
    onLoadChildren: (parentId: string) => dispatch(loadOrganizations(parentId)),
    onSelectItem: (orgId: string) => dispatch(push(`/organization/${orgId}`))
  }),
  (stateProps, dispatchProps, ownProps: {organization: Organization}) => ({
    ...ownProps,
    ...dispatchProps,
    selected: stateProps.selected === ownProps.organization.id,
    children: stateProps.getChildren(ownProps.organization)
  })
)(AppNavOrganizationItemComponent);

export default AppNavOrganizationItem;
