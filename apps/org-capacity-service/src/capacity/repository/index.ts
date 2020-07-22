import { LocationRepository } from './location';
import { PersonRepository } from './person';
import { OrganizationRepository } from './organization';
import { AvailabilityRepository } from './availability';

export * from './availability';
export * from './organization';
export * from './person';
export * from './location';

export interface Repositories {
  availability: AvailabilityRepository
  location: LocationRepository
  person: PersonRepository
  organization: OrganizationRepository
}
