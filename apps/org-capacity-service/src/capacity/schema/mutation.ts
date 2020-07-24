import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    upsertAvailabilityStatusTypes(
      types: [AvailabilityStatusTypeUpdate]!
    ): [AvailabilityStatusType]

    importOrganization(
      parentId: ID,
      defaultStatusTypeId: ID!, 
      org: NewOrganization!
    ): Organization

    setPersonAvailability(
      organizationId: ID!, 
      personId: ID!, 
      availability: AvailabilityStatusUpdate!
    ): Person

    updateOrganization(organizationId: ID!, update: OrganizationUpdate!): Organization
    
    updateOrganizationRoles(
      organizationId: ID!, 
      roles: [RoleUpdate]!
    ): Organization

    deleteOrganizationRole(
      organizationId: ID!,
      roleId: ID!
    ): Organization
  }
`;
