import { 
  AvailabilityStatus, 
  Person, 
  PersonCriteria 
} from '@org-capacity/org-capacity-common';

export interface PersonState {
  results: []
  people: {
    [id: string]: Person
  }
  criteria: PersonCriteria
  availabilityUpdated: {
    [id: string]: { 
      organizationId: string, 
      status: AvailabilityStatus 
    }
  }
}
