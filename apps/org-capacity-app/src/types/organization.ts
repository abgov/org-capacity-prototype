import { 
  Organization as BaseOrganization,
  OrganizationCapacity
} from '@org-capacity/org-capacity-common';
import { Role } from './role';

export type OrganizationDetailsType = 'capacity' | 'roles' ;

export interface Organization extends BaseOrganization {
  children?: Organization[]
  capacity: OrganizationCapacity
  roles: Role[]
}

export interface OrganizationState {
  organizations: {
    [id: string]: Organization
  }
  results: string[]
  organizationId: string
  modified: Organization
  modifiedRoles: {
    [id: string]: Role
  }
}
