import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, Container, Typography, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LoadResourceWrapper, MetricPane } from '../../common';
import { Role, Organization, AppState } from '../../types';
import OrganizationRoles, { rolesSelector } from '../organization-roles/organization-roles';

interface OrganizationDetailsProps {
  organization: Organization
  roles: Role[]
  isLoading: boolean
}

const useStyles = makeStyles(theme => ({
  root: {
    border: '1px solid #dcdcdc', 
    background: '#fff',
    overflow: 'hidden',
    minHeight: '100%',
    '& section': {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2)
    }
  },
  header: {
    display: 'flex',
    '& > div:first-child': {
      marginRight: theme.spacing(6)
    }
  }
}));

const OrganizationDetails = ({
  organization, 
  roles,
  isLoading
}: OrganizationDetailsProps) => {
  const classes = useStyles({});

  return (
    <LoadResourceWrapper className={classes.root} 
      resource={organization && roles} 
      isLoading={isLoading}
      renderContent={() =>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Container maxWidth="lg">
            <section>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={4}>
                  <Typography variant="h5">
                    {organization.name}
                  </Typography>
                  <Typography variant="h6">
                    Team Capacity
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <MetricPane name="Working" 
                        value={`${
                          roles.filter(r => 
                            r.assigned && 
                            r.assigned.availability && 
                            (r.assigned.availability.capacity > 30)
                          ).length}/${roles.length}`}/>
                    </Grid>
                    <Grid item xs={3}>
                      <MetricPane name="% Capacity" 
                        value={Math.round(roles.reduce((v, r) => {
                          return v + (
                            (r.assigned && r.assigned.availability) ? 
                            (r.assigned.availability.capacity || 0) : 
                            0);
                        }, 0) * 10 / (roles.length)) / 10}/>
                    </Grid>
                    <Grid item xs={3}>
                      <MetricPane name="Vacant roles" 
                        value={roles.filter(r => !r.assigned).length}/>
                    </Grid>
                    <Grid item xs={3}>
                      <MetricPane name="Absences" 
                        value={roles.filter(
                          r => r.assigned && 
                            r.assigned.availability && 
                            (!r.assigned.availability.capacity)
                        ).length}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </section>
            <section>
              <Typography variant="h6">
                People and roles
              </Typography>
              <OrganizationRoles />
            </section>
            {/* <section>
              <Typography variant="h6">
                Organization
              </Typography>
            </section> */}
          </Container>
        </MuiPickersUtilsProvider>
    } />
  )
}

const organizationSelector = createSelector(
  (state: AppState) => state.organization.organizationId,
  (state: AppState) => state.organization.organizations,
  (orgId, orgs) => orgId ? orgs[orgId] : null
)

const isLoadingSelector = createSelector(
  (state: AppState) => state.organization.organizationId,
  (state: AppState) => state.busy,
  (orgId, busy) => busy[`load-org-${orgId}`]
)

export default connect(
  (state: AppState) => ({
    organization: organizationSelector(state),
    roles: rolesSelector(state),
    isLoading: isLoadingSelector(state)
  })
)(OrganizationDetails);
