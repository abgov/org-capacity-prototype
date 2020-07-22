import { OrganizationState } from '../../types';
import { OrganizationActionTypes, ORGANIZATIONS_LOADED, ORGANIZATION_LOADED, ORGANIZATION_VIEW, ORGANIZATION_ROLE_MODIFY, ORGANIZATION_ROLES_SAVED, ORGANIZATION_ROLE_DELETED } from '../actions';

const defaultState: OrganizationState = {
  organizations: {},
  results: [],
  organizationId: null,
  modified: null,
  modifiedRoles: {}
}

export const organizationReducer = (state = defaultState, action: OrganizationActionTypes) => {

  switch (action.type) {
    case ORGANIZATIONS_LOADED: {
      const newState = {
        ...state,
        results: !action.parentEquals ? 
          action.organizations.map(org => org.id) : 
          state.results
      }
      
      if (action.parentEquals) {
        const parent = state.organizations[action.parentEquals];
        newState.organizations[action.parentEquals] = {
          ...parent,
          children: []
        }
      }

      action.organizations.forEach(org => {
        
        newState.organizations[org.id] = {
          ...state.organizations[org.id], 
          ...org
        }
        
        if (action.parentEquals) {
          newState.organizations[action.parentEquals].children.push(
            org
          );
        }
      });

      return newState;
    }
    case ORGANIZATION_LOADED: {
      return {
        ...state, 
        organizations: {
          ...state.organizations,
          [action.organizationId] : {
            ...action.organization,
            roles: action.organization.roles ? 
              action.organization.roles.map(r => ({
                ...r, 
                assigned: r.assigned ? {
                  id: r.assigned.id
                }: null
              })) : null
          }
        }
      }
    }
    case ORGANIZATION_VIEW: {
      return {
        ...state,
        organizationId: action.organizationId
      }
    }
    case ORGANIZATION_ROLE_MODIFY: {
      return {
        ...state,
        modifiedRoles: {
          ...state.modifiedRoles,
          [action.roleId]: action.role
        }
      }
    }
    case ORGANIZATION_ROLES_SAVED: {
      return {
        ...state,
        organizations: {
          ...state.organizations,
          [action.organizationId]: {
            ...state.organizations[action.organizationId],
            ...action.organization
          }
        },
        modifiedRoles: {}
      }
    }
    case ORGANIZATION_ROLE_DELETED: {
      const newState = {
        ...state,
        organizations: {
          ...state.organizations,
          [action.organizationId]: {
            ...state.organizations[action.organizationId],
            ...action.organization
          }
        }
      }

      return newState;
    }
    default:
      return state;
  }
}
