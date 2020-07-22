import { Role } from './role';

export type OrganizationDetailsType = 'capacity' | 'roles' ;

export interface Organization {
  id: string
  type: string
  name: string
  roles: Role[]
}

export interface OrganizationCapacity {
  capacity: number
  totalRoles: number
  vacantRoles: number
  statusCounts: {
    typeId: string
    count: number
  }[]
}

export interface OrganizationCriteria {
  idEquals?: string
  typeEquals?: string
  parentEquals?: string
  nameContains?: string
  includesAssigned?: string
}
