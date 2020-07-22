import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Edit } from '@material-ui/icons';
import { Grid, CardHeader, CardContent, IconButton } from '@material-ui/core';
import { Card, MetricPane, LoadResourceWrapper } from '../../common';
import { Organization, AppState, AvailabilityStatusType } from '../../types';
import AreaAvailabilityChartPane from '../area-availability-chart-pane/area-availability-chart-pane';
import AvailabilityPieChartPane from '../availability-pie-chart-pane/availability-pie-chart-pane';

interface OrganizationCapacityProps {
  canEdit: boolean
  organization: Organization
  statusTypes: {
    [id: string]: AvailabilityStatusType
  }
}

const OrganizationCapacity = ({
  canEdit,
  organization, 
  statusTypes
}: OrganizationCapacityProps) => {
  return (
    <LoadResourceWrapper isLoading={!organization} resource={organization} renderContent={() =>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={organization.name} 
              action={
                canEdit &&
                <IconButton>
                  <Edit />
                </IconButton>
              }/>
            <CardContent>
              <Grid container spacing={2}>
                {
                  organization.children &&
                  <Grid item xs={7}>
                    <AreaAvailabilityChartPane 
                      statusTypes={Object.entries(statusTypes).map(([_, v]) => v)}
                      areas={
                        organization.children.map(c => ({
                          name: c.name, 
                          ...c.capacity
                        })).filter(c => c.statusCounts)
                      }
                    />
                  </Grid>
                }
                {
                  organization.capacity &&
                  <Grid item xs={5}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <AvailabilityPieChartPane statuses={[
                          { name: 'Vacant', count: organization.capacity.vacantRoles },
                          ...organization.capacity.statusCounts.map(s => ({
                            name: statusTypes[s.typeId] && statusTypes[s.typeId].name,
                            count: s.count
                          })).sort(s => s.count)
                        ]} />
                      </Grid>
                      <Grid item xs={12}>
                        <MetricPane name="% Capacity" 
                          value={Math.round(organization.capacity.capacity * 10) / 10} 
                          isLoading={false}/>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    }/>
  )
}

const organizationSelector = createSelector(
  (state: AppState) => state.organization.organizationId,
  (state: AppState) => state.organization.organizations,
  (orgId, orgs) => orgId ? orgs[orgId] : null
)

export default connect(
  (state: AppState) => ({
    canEdit: state.user.roles.includes('service-admin'),
    organization: organizationSelector(state),
    statusTypes: state.availability.types
  })
)(OrganizationCapacity);
