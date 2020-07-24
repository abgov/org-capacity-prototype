import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
import { 
  Results, 
  OrganizationCriteria, 
  OrganizationCapacity 
} from '@org-capacity/org-capacity-common';
import { 
  Organization,
  AvailabilityStatusType, 
  OrganizationDetailsType, 
  Person, 
  AvailabilityStatus,
  Role,
  PersonCriteria
} from '../../types';
import { graphql } from './graphql';


export interface AvailabilityService {
  getAvailabilityStatusTypes(): Observable<AvailabilityStatusType[]>
}

export const createAvailabilityService = ({GRAPH_API_URL}): AvailabilityService => ({
  getAvailabilityStatusTypes: () => {
    const query = gql`
      query {
        availabilityStatusTypes {
          id
          name
          planned
          capacity
        }
      }
    `;

    return graphql(GRAPH_API_URL, query, {}, 'availabilityStatusTypes');
  }
})

export interface OrganizationService {
  getOrganizations(
    token: string, 
    top: number, 
    after: string,
    criteria: OrganizationCriteria
  ): Observable<Results<Organization>>
  getOrganization(token: string, id: string, details?: OrganizationDetailsType[]): Observable<Organization>
  getOrganizationCapacity(token: string, id: string): Observable<OrganizationCapacity>
  updateOrganizationRoles(token: string, id: string, roles: Role[]): Observable<Organization>
  deleteOrganizationRole(token: string, id: string, roleId: string): Observable<Organization>
}

export const createOrganizationService = ({GRAPH_API_URL}): OrganizationService => ({
  getOrganizations: (token: string, top: number, after: string, criteria: OrganizationCriteria) => {
    const query = gql`
      query GetOrganizations($top: Int, $after: String, $criteria: OrganizationCriteria) {
        organizations(top: $top, after: $after, criteria: $criteria) {
          results {
            id
            name
            children {
              id
            }
          }
          page {
            after
            next
          }
        }
      }
    `;

    return graphql(GRAPH_API_URL, query, { top, after, criteria }, 'organizations', token).pipe(
      map((organizations) => ({
        page: organizations.page,
        results: organizations.results
      }))
    );
  },

  getOrganization: (token: string, id: string, details: string[] = []) => {
    const query = gql`
      query GetOrganization($id: ID!) {
        organization(id: $id) {
          id
          name
          children {
            id
            name
            ${details.includes('capacity') ? 
              `capacity {
                totalRoles
                vacantRoles
                capacity
                statusCounts {
                  typeId
                  count
                }
              }` :
              ''
            }
          }
          ${details.includes('capacity') ? 
            `capacity {
              totalRoles
              vacantRoles
              capacity
              statusCounts {
                typeId
                count
              }
            }` :
            ''
          }
          ${details.includes('roles') ? 
            `roles {
              id
              name
              assigned {
                id
                firstName
                lastName
                middleName
                availability {
                  typeId
                  capacity
                  start
                }
              }
            }` :
            ''
          }
        }
      }
    `;

    return graphql(GRAPH_API_URL, query, { id }, 'organization', token);
  },
  
  getOrganizationCapacity: (token: string, id: string) => {
    const query = gql`
      query GetOrganization($id: ID!, $isExternalId: Boolean) {
        organization(id: $id, isExternalId: $isExternalId) {
          id
          capacity {
            totalRoles
            vacantRoles
            capacity
            statusCounts {
              typeId
              count
            }
          }
        }
      }
    `;

    return graphql(GRAPH_API_URL, query, { id }, 'organization.capacity', token);
  },

  updateOrganizationRoles: (token: string, id: string, roles: Role[]) => {
    const query = gql`
      mutation UpdateOrganizationRoles($id: ID!, $roles: [RoleUpdate]!) {
        updateOrganizationRoles(organizationId: $id, roles: $roles) {
          id
          roles {
            id
            name
            assigned {
              id
              firstName
              lastName
              middleName
              availability {
                typeId
                capacity
                start
              }
            }
          }
        }
      }
    `;

    return graphql(
      GRAPH_API_URL, 
      query, 
      { id, roles }, 
      'updateOrganizationRoles', 
      token
    );
  },

  deleteOrganizationRole: (token: string, id: string, roleId: string) => {
    const query = gql`
      mutation DeleteOrganizationRole($id: ID!, $roleId: ID!) {
        deleteOrganizationRole(organizationId: $id, roleId: $roleId) {
          id
          roles {
            id
            name
            assigned {
              id
              firstName
              lastName
              middleName
              availability {
                typeId
                capacity
                start
              }
            }
          }
        }
      }
    `;

    return graphql(
      GRAPH_API_URL, 
      query, 
      { id, roleId }, 
      'deleteOrganizationRole', 
      token
    );
  }
})

export interface PersonService {
  getPeople(
    token: string,
    top: number,
    after: string,
    criteria: PersonCriteria
  ): Observable<Results<Person>>
  setAvailability(
    token: string, 
    organizationId: string, 
    personId: string, 
    availability: AvailabilityStatus
  ): Observable<Person>
}

export const createPersonService = ({GRAPH_API_URL}): PersonService => ({
  getPeople: (token: string, top: number, after: string, criteria: PersonCriteria) => {

    const query = gql`
      query GetPeople($top: Int, $after: String, $criteria: PersonCriteria) {
        people(top: $top, after: $after, criteria: $criteria) {
          results {
            id
            firstName
            lastName
            middleName
            availability {
              typeId
              capacity
              start
              plannedEnd
            }
          }
          page {
            after
            next
          }
        }
      }
    `;

    return graphql(GRAPH_API_URL, query, {
      top,
      after,
      criteria
    }, 'people', token);
  },
  setAvailability: (token, organizationId, personId, availability) => {
    const query = gql`
      mutation($organizationId: ID!, $personId: ID!, $availability: AvailabilityStatusUpdate!) {
        setPersonAvailability(
          organizationId: $organizationId, personId: $personId, availability: $availability
        ) {
          id
          availability {
            typeId
            capacity
            start
            plannedEnd
          }
        }
      }
    `;

    return graphql(GRAPH_API_URL, query, {
      organizationId,
      personId,
      availability: {
        ...availability,
        start: availability.start ?
          format(availability.start, 'yyyy-MM-dd') : null
      }
    }, 'setPersonAvailability', token).pipe(
      map((person) => ({
        ...person,
        availability: {
          ...person.availability,
          start: person.availability.start ?
            new Date(person.availability.start) : null
        }
      }))
    );
  }
})

export interface Services {
  availability: AvailabilityService
  organization: OrganizationService
  person: PersonService
}

export const createServices = (environment): Services => ({
  availability: createAvailabilityService(environment),
  organization: createOrganizationService(environment),
  person: createPersonService(environment)
})
