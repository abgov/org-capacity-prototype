import { gql } from 'apollo-server-express';

export default gql`
  type Location {
    id: String
    fullAddress: String
  }

  input NewLocation {
    fullAddress: String
  }
`
