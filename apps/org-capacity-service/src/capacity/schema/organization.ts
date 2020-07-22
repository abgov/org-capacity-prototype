import { gql } from 'apollo-server-express';

export default gql`

  type StatusCount {
    typeId: ID
    count: Int
  }
  
  type OrganizationCapacity {
    totalRoles: Int
    vacantRoles: Int
    statusCounts: [StatusCount]
    capacity: Float
  }

  type Organization {
    id: ID
    parent: Organization
    children: [Organization]
    type: String
    name: String
    location: Location
    roles: [Role]
    capacity: OrganizationCapacity
  }

  type OrganizationResults {
    results: [Organization]
    page: Page
  }

  input OrganizationCriteria {
    typeEquals: String
    parentEquals: ID
    nameContains: String
  }

  input NewOrganization {
    type: String
    name: String
    location: NewLocation
    children: [NewOrganization]
    roles: [NewRole]
  }

  input OrganizationUpdate {
    type: String
    name: String
    parentId: ID
  }
`
