import { Results } from '@org-capacity/org-capacity-common';
import { 
  BusyAction, 
  AvailabilityStatus, 
  PersonCriteria, 
  Person 
} from '../../types';

export const PERSON_AVAILABILITY_MODIFY = 'PERSON/AVAILABILITY_MODIFY';
export const PERSON_AVAILABILITY_SAVING = 'PERSON/AVAILABILITY_SAVING';
export const PERSON_AVAILABILITY_SAVED = 'PERSON/AVAILABILITY_SAVED';

export const PEOPLE_SEARCH_MODIFY = 'PERSON/PEOPLE_SEARCH_MODIFY';
export const PEOPLE_SEARCHING = 'PERSON/PEOPLE_SEARCHING';
export const PEOPLE_SEARCHED = 'PERSON/PEOPLE_SEARCHED';

export interface PersonAvailabilityModifyAction {
  type: typeof PERSON_AVAILABILITY_MODIFY
  personId: string
  organizationId: string
  status: AvailabilityStatus
}

export interface PersonAvailabilitySavingAction extends BusyAction {
  type: typeof PERSON_AVAILABILITY_SAVING
  personId: string
  organizationId: string
  status: AvailabilityStatus
}

export interface PersonAvailabilitySavedAction extends BusyAction {
  type: typeof PERSON_AVAILABILITY_SAVED
  personId: string
  organizationId: string
  status: AvailabilityStatus
}

export interface PeopleSearchModifyAction {
  type: typeof PEOPLE_SEARCH_MODIFY
  criteria: PersonCriteria
}

export interface PeopleSearchingAction extends BusyAction {
  type: typeof PEOPLE_SEARCHING
  criteria: PersonCriteria
}

export interface PeopleSearchedAction extends BusyAction {
  type: typeof PEOPLE_SEARCHED
  people: Person[]
}

export type PersonActionTypes = PersonAvailabilityModifyAction |
  PersonAvailabilitySavingAction | PersonAvailabilitySavedAction |
  PeopleSearchModifyAction | PeopleSearchingAction | PeopleSearchedAction

export const modifyPersonAvailability = (
  organizationId: string,
  personId: string, 
  status: AvailabilityStatus
): PersonAvailabilityModifyAction => ({
  type: PERSON_AVAILABILITY_MODIFY,
  organizationId,
  personId,
  status
})

export const savePersonAvailability = (
  organizationId: string,
  personId: string, 
  status: AvailabilityStatus
): PersonAvailabilitySavingAction => ({
  type: PERSON_AVAILABILITY_SAVING,
  operation: `update-status-${personId}`,
  isBusy: true,
  organizationId,
  personId,
  status
})

export const savedPersonAvailability = (
  organizationId: string,
  personId: string, 
  status: AvailabilityStatus
): PersonAvailabilitySavedAction => ({
  type: PERSON_AVAILABILITY_SAVED,
  operation: `update-status-${personId}`,
  isBusy: false,
  organizationId,
  personId,
  status
})

export const modifyPeopleSearch = (
  criteria: PersonCriteria
): PeopleSearchModifyAction => ({
  type: PEOPLE_SEARCH_MODIFY,
  criteria
})

export const searchPeople = (criteria: PersonCriteria): PeopleSearchingAction => ({
  type: PEOPLE_SEARCHING,
  operation: 'search-people',
  isBusy: true,
  criteria
})

export const searchedPeople = (results: Results<Person>): PeopleSearchedAction => ({
  type: PEOPLE_SEARCHED,
  operation: 'search-people',
  isBusy: false,
  people: results.results
})
