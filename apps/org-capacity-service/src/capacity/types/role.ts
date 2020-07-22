import { Role as BaseRole } from '@org-capacity/org-capacity-common';
import { NewPerson } from './person';

export interface Role extends BaseRole {
  assignedId?: string
}

export interface NewRole {
  name: string
  assigned?: NewPerson
}
