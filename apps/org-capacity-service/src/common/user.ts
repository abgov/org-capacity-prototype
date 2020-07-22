export enum UserRole {
  ServiceAdmin = 'service-admin',
  OrganizationAdmin = 'org-admin'
}

export interface User {
  id: string
  email: string
  name: string
  organizationId: string
  roles: UserRole[]
}
