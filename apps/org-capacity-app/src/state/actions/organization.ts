import { 
  BusyAction, 
  Organization, 
  OrganizationDetailsType, 
  Role 
} from '../../types';

export const ORGANIZATIONS_LOADING = 'ORGANIZATION/ORGS_LOADING';
export const ORGANIZATIONS_LOADED = 'ORGANIZATION/ORGS_LOADED';

export const ORGANIZATION_LOADING = 'ORGANIZATION/ORG_LOADING';
export const ORGANIZATION_LOADED = 'ORGANIZATION/ORG_LOADED';
export const ORGANIZATION_LOAD_FAILED = 'ORGANIZATION/ORG_LOAD_FAILED';

export const ORGANIZATION_VIEW = 'ORGANIZATION/ORG_VIEW';

export const ORGANIZATION_ROLE_MODIFY = 'ORGANIZATION/ROLE_MODIFY';

export const ORGANIZATION_ROLES_SAVING = 'ORGANIZATION/ROLES_SAVING';
export const ORGANIZATION_ROLES_SAVED = 'ORGANIZATION/ROLES_SAVED';

export const ORGANIZATION_ROLE_DELETING = 'ORGANIZATION/ROLE_DELETING';
export const ORGANIZATION_ROLE_DELETED = 'ORGANIZATION/ROLE_DELETED';

export interface OrganizationsLoadingAction extends BusyAction {
  type: typeof ORGANIZATIONS_LOADING
  parentEquals: string
  typeEquals: string
}

export interface OrganizationsLoadedAction extends BusyAction {
  type: typeof ORGANIZATIONS_LOADED
  parentEquals: string
  organizations: Organization[]
}

export interface OrganizationLoadingAction extends BusyAction {
  type: typeof ORGANIZATION_LOADING
  organizationId: string
  details: OrganizationDetailsType[]
}

export interface OrganizationLoadedAction extends BusyAction {
  type: typeof ORGANIZATION_LOADED
  organizationId: string
  organization: Organization
}

export interface OrganizationLoadFailedAction extends BusyAction {
  type: typeof ORGANIZATION_LOAD_FAILED
  organizationId: string
}

export interface OrganizationViewAction {
  type: typeof ORGANIZATION_VIEW
  organizationId: string
}

export interface OrganizationRoleModifyAction {
  type: typeof ORGANIZATION_ROLE_MODIFY
  organizationId: string
  roleId: string
  role: Role
}

export interface OrganizationRolesSavingAction extends BusyAction {
  type: typeof ORGANIZATION_ROLES_SAVING
  organizationId: string
  roles: Role[]
}

export interface OrganizationRolesSavedAction extends BusyAction {
  type: typeof ORGANIZATION_ROLES_SAVED
  organizationId: string
  organization: Organization
}

export interface OrganizationRoleDeletingAction extends BusyAction {
  type: typeof ORGANIZATION_ROLE_DELETING
  organizationId: string
  roleId: string
}

export interface OrganizationRoleDeletedAction extends BusyAction {
  type: typeof ORGANIZATION_ROLE_DELETED
  organization: Organization
  organizationId: string
  roleId: string
}

export type OrganizationActionTypes = 
  OrganizationsLoadingAction | OrganizationsLoadedAction |
  OrganizationLoadingAction | OrganizationLoadedAction | 
  OrganizationViewAction | OrganizationRoleModifyAction |
  OrganizationRolesSavingAction | OrganizationRolesSavedAction |
  OrganizationRoleDeletingAction | OrganizationRoleDeletedAction

export const loadOrganizations = (parentId?: string, type?: string): OrganizationsLoadingAction => ({
  type: ORGANIZATIONS_LOADING,
  operation: 'load-orgs',
  isBusy: true,
  parentEquals: parentId,
  typeEquals: type
})

export const loadedOrganizations = (
  parentId: string, organizations: Organization[]
): OrganizationsLoadedAction => ({
  type: ORGANIZATIONS_LOADED,
  operation: 'load-orgs',
  isBusy: false,
  parentEquals: parentId,
  organizations
})

export const loadOrganization = (
  organizationId: string, 
  details: OrganizationDetailsType[] = [])
: OrganizationLoadingAction => ({
  type: ORGANIZATION_LOADING,
  operation: `load-org-${organizationId}`,
  isBusy: true,
  organizationId,
  details
})

export const loadedOrganization = (
  organizationId: string, 
  organization: Organization
): OrganizationLoadedAction => ({
  type: ORGANIZATION_LOADED,
  operation: `load-org-${organizationId}`,
  isBusy: false,
  organizationId,
  organization
})

export const loadOrganizationFailed = (
  organizationId: string
): OrganizationLoadFailedAction => ({
  type: ORGANIZATION_LOAD_FAILED,
  operation: `load-org-${organizationId}`,
  isBusy: false,
  organizationId
})

export const viewOrganization = (organizationId: string): OrganizationViewAction => ({
  type: ORGANIZATION_VIEW,
  organizationId
})

export const modifyOrganizationRole = (
  organizationId: string, 
  roleId: string,
  role: Role
): OrganizationRoleModifyAction => ({
  type: ORGANIZATION_ROLE_MODIFY,
  organizationId,
  roleId,
  role
})

export const saveOrganizationRoles = (
  organizationId: string,
  roles: Role[]
): OrganizationRolesSavingAction => ({
  type: ORGANIZATION_ROLES_SAVING,
  operation: `save-${organizationId}-roles`,
  isBusy: true,
  organizationId,
  roles
})

export const savedOrganizationRoles = (
  organizationId: string, 
  organization: Organization
): OrganizationRolesSavedAction => ({
  type: ORGANIZATION_ROLES_SAVED,
  operation: `save-${organizationId}-roles`,
  isBusy: false,
  organizationId,
  organization
})

export const deleteOrganizationRole = (
  organizationId: string, 
  roleId: string
): OrganizationRoleDeletingAction => ({
  type: ORGANIZATION_ROLE_DELETING,
  operation: `delete-org-${organizationId}-role-${roleId}`,
  isBusy: true,
  organizationId,
  roleId
})

export const deletedOrganizationRole = (
  organization: Organization,
  organizationId: string,
  roleId: string,
): OrganizationRoleDeletedAction => ({
  type: ORGANIZATION_ROLE_DELETED,
  operation: `delete-org-${organizationId}-role-${roleId}`,
  isBusy: false,
  organization,
  organizationId,
  roleId
})
