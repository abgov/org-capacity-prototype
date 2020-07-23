import { PersonActionTypes, OrganizationActionTypes, PERSON_AVAILABILITY_MODIFY, PERSON_AVAILABILITY_SAVED, ORGANIZATION_LOADED, PEOPLE_SEARCH_MODIFY, PEOPLE_SEARCHED } from '../actions';
import { PersonState } from '../../types';

const defaultState: PersonState = {
  results: [],
  people: {},
  criteria: {},
  availabilityUpdated: {}
}

export const personReducer = (
  state = defaultState, 
  action: PersonActionTypes | OrganizationActionTypes
) => {
  switch (action.type) {
    case ORGANIZATION_LOADED: {
      const newState = {
        ...state
      }

      if (
        action.organization &&
        action.organization.roles
      ) {
        action.organization.roles.forEach(
          r => {
            if (r.assigned) {
              newState.people[r.assigned.id] = {
                ...r.assigned,
                availability: {
                  ...(r.assigned.availability || { typeId: '5e7e8a04ea558700cccead15', capacity: 100 }),
                  start: (r.assigned.availability || {}).start ?
                    new Date(r.assigned.availability.start) : null
                }
              };
            }
          }
        )
      }

      return newState;
    }
    case PERSON_AVAILABILITY_MODIFY: {
      return {
        ...state,
        availabilityUpdated: {
          ...state.availabilityUpdated,
          [action.personId]: {
            organizationId: action.organizationId,
            status: action.status
          }
        }
      }
    }
    case PERSON_AVAILABILITY_SAVED: {
      const newState = {
        ...state,
        people: {
          ...state.people,
          [action.personId]: {
            ...state.people[action.personId],
            availability: action.status
          }
        }
      }
      
      delete newState.availabilityUpdated[action.personId];

      return newState;
    }
    case PEOPLE_SEARCH_MODIFY: {
      return {
        ...state,
        criteria: {...action.criteria}
      }
    }
    case PEOPLE_SEARCHED: {
      const newState = {
        ...state,
        results: action.people.map(p => p.id)
      }

      action.people.forEach(p => {
        newState.people[p.id] = p;
      });

      return newState;
    }
    default:
      return state;
  }
}