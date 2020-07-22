import { Role as BaseRole, Person } from '@org-capacity/org-capacity-common';

export interface Role extends BaseRole {
  assigned?: Person
}
