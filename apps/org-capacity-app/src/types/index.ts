import { RouterState } from 'connected-react-router';
import { UserState } from './user';
import { BusyState } from './busy';
import { OrganizationState } from './organization';
import { AvailabilityState } from './availability';
import { PersonState } from './person';

export * from './busy';
export * from './user';
export * from './availability';
export * from './role';
export * from './organization';
export * from './person';
export * from './error';

export { 
  AvailabilityStatusType,
  AvailabilityStatus,
  Person,
  PersonCriteria,
  OrganizationDetailsType
} from '@org-capacity/org-capacity-common';

export interface AppState {
  router: RouterState
  user: UserState
  busy: BusyState
  availability: AvailabilityState
  organization: OrganizationState
  person: PersonState
}
