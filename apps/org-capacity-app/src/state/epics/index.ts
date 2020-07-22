import { combineEpics } from 'redux-observable';
import { UserManager } from 'oidc-client';
import { environment } from '../../environments/environment';
import { createUserEpics } from './user';
import { createOrganizationEpics } from './organization';
import { createServices } from './services';
import { createAvailabilityEpics } from './availability';
import { createPersonEpics } from './person';

export const createAppEpic = (userManager: UserManager) => {

  const services = createServices(environment);

  const { loginUserEpic, logoutUserEpic, loginRedirectEpic } = createUserEpics({}, userManager);
  const { loadAvailabilityStatusTypesEpic } = createAvailabilityEpics(services);
  const { 
    loadOrganizationsEpic, 
    loadOrganizationEpic,
    initializeOrganizationEpic,
    initializeOrganizationCapacityEpic,
    initializeOrganizationDetailsEpic,
    saveOrganizationRolesEpic,
    autoSaveOrganizationRolesEpic,
    deleteOrganizationRoleEpic
  } = createOrganizationEpics(services);
  const { 
    searchPeopleEpic,
    autoSearchPeopleEpic,
    saveAvailabilityEpic, 
    autoSaveAvailabilityEpic 
  } = createPersonEpics(services);
  
  const appEpic = combineEpics(
    loginUserEpic,
    logoutUserEpic,
    loginRedirectEpic,
    loadAvailabilityStatusTypesEpic,
    loadOrganizationsEpic,
    loadOrganizationEpic,
    initializeOrganizationEpic,
    initializeOrganizationCapacityEpic,
    initializeOrganizationDetailsEpic,
    saveOrganizationRolesEpic,
    autoSaveOrganizationRolesEpic,
    deleteOrganizationRoleEpic,
    searchPeopleEpic,
    autoSearchPeopleEpic,
    saveAvailabilityEpic,
    autoSaveAvailabilityEpic
  );

  return appEpic;
}
