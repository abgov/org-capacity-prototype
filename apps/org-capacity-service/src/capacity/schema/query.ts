import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    availabilityStatusTypes: [AvailabilityStatusType]

    organizations(top: Int = 10, after: String, criteria: OrganizationCriteria): OrganizationResults
    organization(id: ID, isExternalId: Boolean): Organization

    people(top: Int = 10, after: String, criteria: PersonCriteria): PersonResults
  }
`;
