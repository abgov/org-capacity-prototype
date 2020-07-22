import { gql } from 'apollo-server-express';

export default gql` 

  type Person {
    id: String
    firstName: String
    middleName: String
    lastName: String
    phone: String
    fax: String
    location: Location
    availability: AvailabilityStatus
  }

  input NewPerson {
    firstName: String
    middleName: String
    lastName: String
    phone: String
    fax: String
    location: NewLocation
  }

  input PersonCriteria {
    nameContains: String
  }

  type PersonResults {
    results: [Person]
    page: Page
  }
`
