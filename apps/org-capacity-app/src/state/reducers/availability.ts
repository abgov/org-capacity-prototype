import { AvailabilityActionTypes, AVAILABILITY_STATUS_TYPES_LOADED } from '../actions';
import { AvailabilityState } from '../../types';

const defaultState: AvailabilityState = {
  types: {},
  results: []
}

export const availabilityReducer = (state = defaultState, action: AvailabilityActionTypes) => {
  switch(action.type) {
    case AVAILABILITY_STATUS_TYPES_LOADED: {
      const newState = {
        ...state,
        results: action.types.map(s => s.id)
      }

      action.types.forEach(s => {
        newState.types[s.id] = s;
      })

      return newState;
    }
    default:
      return state;
  }
}
