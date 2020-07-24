import { UserRole } from '@org-capacity/org-capacity-common';
import { 
  RequestContext,
  InvalidOperationError, 
  UnauthorizedError 
} from '../../common';
import { Repositories } from '../repository';
import { OrganizationEntity, PersonEntity } from '../model';
import { AvailabilityStatusType } from '../types';

export const createPersonResolvers = (repos: Repositories) => ({
  Query: {
    people: (
      _, 
      {top, after, criteria}, 
      context: RequestContext
    ) => repos.person.getPersons(context.user, top, after, criteria)
  },
  Mutation: {
    setPersonAvailability: (
      _, 
      {organizationId, personId, availability}, 
      context: RequestContext
    ) => repos.organization.getOrganizations(
        context.user, 1, null, {idEquals: organizationId, includesAssigned: personId}
      )
      .then((org) => Promise.all([
          repos.person.getPerson(context.user, personId),
          repos.availability.getStatusType(availability.typeId)
        ])
        .then(([person, type]) => [org.results[0], person, type])
      )
      .then(([org, person, type]: [OrganizationEntity, PersonEntity, AvailabilityStatusType]) => {
        if (!org || !person || !type) {
          throw new InvalidOperationError(
            'Cannot find person associated with organization or status type.');
        }

        if (!context.user.roles.includes(UserRole.ServiceAdmin) &&
          context.user.roles.includes(UserRole.OrganizationAdmin) &&
          context.user.organizationId !== organizationId) {
            throw new UnauthorizedError(
              `User ${context.user.name} (ID: ${context.user.id}) not permitted to update ` +
              `person availability for organization ${org.name} (ID: ${org.id}).`
            )
        }
        
        return person.setAvailability(context.user, type, availability)
          .then((entity) => {
            repos.organization.clearCache(organizationId);
            return entity;
          })
      })
  }
})
