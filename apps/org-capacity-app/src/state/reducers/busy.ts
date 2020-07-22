import { 
  USER_EXPIRED, 
  SILENT_RENEW_ERROR, 
  LOADING_USER, 
  USER_SIGNED_OUT, 
  SESSION_TERMINATED, 
  USER_FOUND 
} from 'redux-oidc';
import { BusyState, BusyAction } from '../../types';

const defaultState: BusyState = {}

export const busyReducer = (state = defaultState, action: BusyAction) => {
  
  switch (action.type) {
    case LOADING_USER:
      return {
        ...state,
        'load-user': true
      }
    case USER_EXPIRED: 
    case USER_SIGNED_OUT:
    case SILENT_RENEW_ERROR:
    case SESSION_TERMINATED:
    case USER_FOUND:
      return {
        ...state,
        'load-user': false
      }
    default:
      return action.operation ? {
        ...state,
        [action.operation]: action.isBusy
      } : state;
  }
}
