import { gql } from 'apollo-server-express';

export default gql`
  type Role {
    id: ID
    name: String
    assigned: Person
  }

  input NewRole {
    name: String
    assignedId: ID
    assigned: NewPerson
  }

  input RoleUpdate {
    id: ID
    name: String
    assignedId: ID
  }
`
