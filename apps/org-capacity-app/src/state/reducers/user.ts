import { AnyAction } from 'redux';
import { USER_FOUND, SESSION_TERMINATED, USER_SIGNED_OUT } from 'redux-oidc';
import { UserState } from '../../types';

const defaultState: UserState = { 
  profile: null, 
  token: null,
  roles: [] 
}

export const userReducer = (state: UserState = defaultState, action: AnyAction) => {
  switch (action.type) {
    case USER_FOUND:
      return action.payload ? {
        ...state,
        profile: {
          id: action.payload.profile.sub,
          name: action.payload.profile.name,
          email: action.payload.profile.email,
          firstName: action.payload.profile.given_name,
          lastName: action.payload.profile.family_name,
          organizationId: action.payload.profile.organizationId,
          organization: action.payload.profile.organization,
          avatar: null
        },
        token: action.payload.access_token,
        roles: action.payload.profile.realm_access.roles
      } : {
        ...state,
        profile: null,
        token: null,
        roles: []
      }
    case SESSION_TERMINATED:
    case USER_SIGNED_OUT:
      return {
        ...state,
        profile: null,
        token: null,
        roles: [],
      }
    default:
      return state;
  }
}
