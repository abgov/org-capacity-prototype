import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import { Repositories } from '../repository';
import { createOrganizationResolvers } from './organization';
import { createAvailabilityResolvers } from './availability';
import { createPersonResolvers } from './person';

export const createResolvers = (props: Repositories) => {
  
  const availability = createAvailabilityResolvers(props);
  const organization = createOrganizationResolvers(props);
  const person = createPersonResolvers(props);

  return {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    ...availability,
    ...organization,
    Query: {
      ...availability.Query,
      ...organization.Query,
      ...person.Query
    },
    Mutation: {
      ...availability.Mutation,
      ...organization.Mutation,
      ...person.Mutation
    }
  }
}
