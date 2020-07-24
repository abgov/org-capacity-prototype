import { UserRole } from '@org-capacity/org-capacity-common';
import { RequestContext, UnauthorizedError } from '../../common';
import { Repositories } from '../repository';

export const createAvailabilityResolvers = (repos: Repositories) => ({
  Query: {
    availabilityStatusTypes: () => repos.availability.getStatusTypes()
  },
  Mutation: {
    upsertAvailabilityStatusTypes: (
      _, 
      {types}, 
      context: RequestContext
    ) => {

      if (!context.user || 
        !context.user.roles.includes(UserRole.ServiceAdmin)) {
        throw new UnauthorizedError('User not permitted to update status types.');
      }

      return repos.availability.saveTypes(context.user, types);
    }
  }
})
