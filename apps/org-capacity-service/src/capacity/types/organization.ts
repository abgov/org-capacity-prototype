import { New } from '../../common';
import { NewRole } from './role';
import { Location } from './location';
import { Organization as BaseOrganization } from '@org-capacity/org-capacity-common';

export interface Organization extends BaseOrganization {
  parentId?: string
  locationId?: string
}

export interface NewOrganization {
  type: string
  name: string
  location: New<Location>
  children: NewOrganization[]
  roles: NewRole[]
}
