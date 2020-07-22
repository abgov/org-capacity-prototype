import { AvailabilityStatus } from './availability';

export interface Person {
  id: string
  firstName: string
  middleName: string
  lastName: string
  phone: string
  fax: string
  availability?: AvailabilityStatus
}

export interface PersonCriteria {
  nameContains?: string
}
