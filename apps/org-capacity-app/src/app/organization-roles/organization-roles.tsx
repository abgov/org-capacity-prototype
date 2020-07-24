import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Delete } from '@material-ui/icons';
import { ToggleButton } from '@material-ui/lab';
import { makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { Role, AvailabilityStatusType, AvailabilityStatus, AppState, PersonCriteria, Person } from '../../types';
import { saveOrganizationRoles, modifyOrganizationRole, modifyPersonAvailability, modifyPeopleSearch, deleteOrganizationRole } from '../../state';
import OrganizationRoleRow from './organization-role-row';
import { UserRole } from '@org-capacity/org-capacity-common';

interface OrganizationRolesProps {
  canEdit: boolean
  organizationId: string
  people: Person[]
  roles: Role[]
  statusTypes: {
    [id: string]: AvailabilityStatusType
  }
  onModifyPersonCriteria: (criteria: PersonCriteria) => void
  onCreateRole: (organizationId: string, role: Role) => void
  onDeleteRole: (organizationId: string, roleId: string) => void
  onModifyRole: (organizationId: string, role: Role) => void
  onUpdateAvailability: (
    organizationId: string, personId: string, status: AvailabilityStatus
  ) => void
}

const useStyles = makeStyles(theme => ({
  tableHeader: {
    '& th': {
      fontWeight: 'bold'
    }
  },
  actions: {
    marginTop: theme.spacing(4),
    display: 'flex',
    '& > :first-child': {
      marginRight: 'auto'
    }
  }
}));

export const OrganizationRoles = ({
  canEdit, 
  organizationId,
  people,
  roles, 
  statusTypes, 
  onModifyPersonCriteria,
  onCreateRole,
  onDeleteRole,
  onModifyRole,
  onUpdateAvailability
}: OrganizationRolesProps) => {
  
  const classes = useStyles({});
  const [showDelete, setShowDelete] = useState(false);
  
  return (
    <div>
      <datalist id="people">
        {
          people.map(p => 
            <option key={p.id} value={p.id}>
              {`${p.firstName} ${p.lastName}`}
            </option>
          )
        }
      </datalist>
      <TableContainer>
        <Table size="small">
          <colgroup>
              <col width="0%" />
              <col width="30%" />
              <col width="25%" />
              <col width="30%" />
              <col width="15%" />
          </colgroup>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell colSpan={canEdit ? 2 : 1}>Role</TableCell>
              <TableCell colSpan={3}>Person</TableCell>
            </TableRow>
            <TableRow>
              {canEdit && <TableCell></TableCell>}
              <TableCell>Title</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Capacity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              roles.map((role, rIdx) => 
                <OrganizationRoleRow key={role.id} 
                  canEdit={canEdit} 
                  showDelete={showDelete}
                  statusTypes={statusTypes} 
                  organizationId={organizationId} 
                  people={people} 
                  role={role} 
                  onModifyPersonCriteria={onModifyPersonCriteria} 
                  onDeleteRole={onDeleteRole}
                  onModifyRole={onModifyRole}
                  onUpdateAvailability={onUpdateAvailability} />
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
      {
        canEdit &&
        <div className={classes.actions}>
          <ToggleButton selected={showDelete}
            onClick={() => setShowDelete(!showDelete)}
          >
            <Delete />
          </ToggleButton>
          <Button variant="outlined" color="primary"
            disabled={showDelete}
            onClick={() => onCreateRole(
              organizationId, {id: null, name: 'New role', assigned: null}
            )}
          >
            Add Role
          </Button>
        </div>
      }
    </div>
  )
}

const peopleSelector = createSelector(
  (state: AppState) => state.person.results,
  (state: AppState) => state.person.people,
  (results, people) => results.map(r => people[r])
)

const organizationSelector = createSelector(
  (state: AppState) => state.organization.organizationId,
  (state: AppState) => state.organization.organizations,
  (orgId, orgs) => orgId ? orgs[orgId] : null
)

const organizationRolesSelector = createSelector(
  organizationSelector,
  (state: AppState) => state.organization.modifiedRoles,
  (org, modified) => ((org && org.roles) || []).map((r) => ({
      ...r,
      ...(modified[r.id] || {})
    }))
)

export const rolesSelector = createSelector(
  organizationRolesSelector,
  (state: AppState) => state.person.people,
  (state: AppState) => state.person.availabilityUpdated,
  (roles, people, updated) => 
    roles.map(r => ({
      ...r,
      assigned: r.assigned ? {
        ...people[r.assigned.id],
        availability: (updated[r.assigned.id] && updated[r.assigned.id].status) || 
          people[r.assigned.id].availability
      } : null
    }))
)

export default connect(
  (state: AppState) => ({
    statusTypes: state.availability.types,
    canEdit: state.user.profile && 
      (
        (
          state.user.roles.includes(UserRole.OrganizationAdmin) &&
          state.user.profile.organizationId === state.organization.organizationId
        ) || 
        state.user.roles.includes(UserRole.ServiceAdmin)
      ),
    organizationId: state.organization.organizationId,
    people: peopleSelector(state),
    roles: rolesSelector(state),
    personCriteria: state.person.criteria
  }),
  (dispatch) => ({
    onModifyPersonCriteria: (
      criteria: PersonCriteria
    ) => dispatch(modifyPeopleSearch(criteria)),
    onCreateRole: (
      organizationId: string, role: Role
    ) => dispatch(saveOrganizationRoles(organizationId, [role])),
    onDeleteRole: (
      organizationId: string, roleId: string
    ) => dispatch(deleteOrganizationRole(organizationId, roleId)),
    onModifyRole: (
      organizationId: string, role: Role
    ) => dispatch(modifyOrganizationRole(organizationId, role.id, role)),
    onUpdateAvailability: (
      organizationId: string, 
      personId: string, 
      status: AvailabilityStatus
    ) => dispatch(modifyPersonAvailability(organizationId, personId, status))
  })
)(OrganizationRoles);
