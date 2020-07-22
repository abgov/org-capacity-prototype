import { of } from 'rxjs';
import { map, filter, switchMap, mergeMap, withLatestFrom, debounceTime } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { matchPath, match } from 'react-router-dom';
import { USER_FOUND } from 'redux-oidc';
import { Action } from 'redux';
import { LOCATION_CHANGE } from 'connected-react-router';
import { Services } from './services';
import { ORGANIZATIONS_LOADING, OrganizationsLoadingAction, loadedOrganizations, loadOrganizations, ORGANIZATION_LOADING, OrganizationLoadingAction, loadedOrganization, loadOrganization, viewOrganization, ORGANIZATION_ROLES_SAVING, OrganizationRolesSavingAction, savedOrganizationRoles, ORGANIZATION_ROLE_MODIFY, OrganizationRoleModifyAction, saveOrganizationRoles, deletedOrganizationRole, OrganizationRoleDeletingAction, ORGANIZATION_ROLE_DELETING } from '../actions';
import { AppState, OrganizationState } from '../../types';

interface OrganizationEpics {
  loadOrganizationsEpic: Epic
  loadOrganizationEpic: Epic
  initializeOrganizationEpic: Epic
  initializeOrganizationCapacityEpic: Epic
  initializeOrganizationDetailsEpic: Epic
  saveOrganizationRolesEpic: Epic
  autoSaveOrganizationRolesEpic: Epic
  deleteOrganizationRoleEpic: Epic
}

export const createOrganizationEpics = (services: Services): OrganizationEpics => ({

  loadOrganizationsEpic: (action$, state$) => action$.pipe(
    ofType(ORGANIZATIONS_LOADING),
    withLatestFrom(state$.pipe(map((s: AppState) => s.user.token), filter(t => !!t))),
    switchMap(([a, t]: [OrganizationsLoadingAction, string]) => 
      services.organization.getOrganizations(
        t, 100, null, { parentEquals: a.parentEquals, typeEquals: a.typeEquals }
      ).pipe(
        map((result) => loadedOrganizations(a.parentEquals, result.results))
      )
    )
  ),
  loadOrganizationEpic: (action$, state$) => action$.pipe(
    ofType(ORGANIZATION_LOADING),
    withLatestFrom(state$.pipe(map((s: AppState) => s.user.token), filter(t => !!t))),
    switchMap(([a, t]: [OrganizationLoadingAction, string]) => 
      services.organization.getOrganization(t, a.organizationId, a.details).pipe(
        map((result) => loadedOrganization(a.organizationId, result))
      )
    )
  ),
  initializeOrganizationEpic: (action$, state$) => action$.pipe(
    ofType(LOCATION_CHANGE, USER_FOUND),
    withLatestFrom(state$),
    filter(([a, s]: [Action, AppState]) => 
      s.router.location.pathname.includes('organization') &&
      !s.organization.results.length
    ),
    map(() => loadOrganizations(null, 'min'))
  ),
  initializeOrganizationCapacityEpic: (action$, state$) => action$.pipe(
    ofType(LOCATION_CHANGE, USER_FOUND),
    withLatestFrom(state$),
    map(([_, s]: [Action, AppState]) => {
      const pathMatch: match<{recordId?: string }> = 
        matchPath(s.router.location.pathname, { path: '/organization/:recordId', exact: true });

      return (pathMatch && s.user.token) ? 
        pathMatch.params.recordId : null;
    }),
    filter((id) => !!id),
    mergeMap((id) => of(viewOrganization(id), loadOrganization(id, ['capacity'])))
  ),
  initializeOrganizationDetailsEpic: (action$, state$) => action$.pipe(
    ofType(LOCATION_CHANGE, USER_FOUND),
    withLatestFrom(state$),
    map(([_, s]: [Action, AppState]) => {
      const pathMatch: match<{recordId?: string }> = 
        matchPath(s.router.location.pathname, { path: '/organization/:recordId/details', exact: true });

      return (pathMatch && s.user.token) ? 
        pathMatch.params.recordId : null;
    }),
    filter((id) => !!id),
    mergeMap((id) => of(viewOrganization(id), loadOrganization(id, ['capacity', 'roles'])))
  ),
  saveOrganizationRolesEpic: (action$, state$) => action$.pipe(
    ofType(ORGANIZATION_ROLES_SAVING),
    withLatestFrom(
      state$.pipe(map((s: AppState) => s.user.token), filter(t => !!t))
    ),
    switchMap(([a, t]: [OrganizationRolesSavingAction, string]) => 
      services.organization.updateOrganizationRoles(
        t, a.organizationId, a.roles.map(r => ({
          id: r.id, 
          name: r.name, 
          assignedId: r.assigned ? r.assigned.id : null
        }))
      ).pipe(
        map((org) => savedOrganizationRoles(a.organizationId, org))
      )
    )
  ),
  autoSaveOrganizationRolesEpic: (action$, state$) => action$.pipe(
    ofType(ORGANIZATION_ROLE_MODIFY),
    debounceTime(3000),
    withLatestFrom(
      state$.pipe(map((s: AppState) => s.organization))
    ),
    map(([_, orgState]: [OrganizationRoleModifyAction, OrganizationState]) => 
      saveOrganizationRoles(
        orgState.organizationId, 
        Object.entries(orgState.modifiedRoles).map(
          ([id, role]) => ({
            id, 
            name: role.name, 
            assigned: role.assigned
          })
        )
      )
    )
  ),
  deleteOrganizationRoleEpic: (action$, state$) => action$.pipe(
    ofType(ORGANIZATION_ROLE_DELETING),
    withLatestFrom(
      state$.pipe(map((s: AppState) => s.user.token), filter(t => !!t))
    ),
    switchMap(([a, t]: [OrganizationRoleDeletingAction, string]) => 
      services.organization.deleteOrganizationRole(
        t,
        a.organizationId,
        a.roleId
      ).pipe(
        map((org) => deletedOrganizationRole(org, a.organizationId, a.roleId))
      )
    )
  )
})
