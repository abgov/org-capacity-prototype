import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Container, Grid } from '@material-ui/core';
import { Organization, AppState } from '../../types';
import { loadOrganizations } from '../../state';
import OrganizationContainer from '../organization/organization';

interface OrganizationStructureProps {
  organizations: Organization[],
  onLoadChildren: (parentId: string) => void
}

const OrganizationStructure = ({
  organizations,
  onLoadChildren
}: OrganizationStructureProps) => {
  
  return (
    <div>
      <section>
        <Container maxWidth="md">
          <Grid container spacing={2}>
          {
            organizations.map(org => 
              <Grid key={org.id} item xs={12}>
                <OrganizationContainer organization={org} onLoadChildren={onLoadChildren} />
              </Grid>
            )
          }
          </Grid>
        </Container>
      </section>
    </div>
  )
}

const organizationsSelector = createSelector(
  (state: AppState) => state.organization.results,
  (state: AppState) => state.organization.organizations,
  (results, orgs) => results.map(r => orgs[r])
)

export default connect(
  (state: AppState) => ({
    organizations: organizationsSelector(state)
  }),
  (dispatch) => ({
    onLoadChildren: (parentId: string) => dispatch(loadOrganizations(parentId))
  })
)(OrganizationStructure);
