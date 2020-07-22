import { gql } from 'apollo-server-express';

export default gql`
  scalar Date
  scalar Time
  scalar DateTime

  type Page {
    after: String
    size: Int
    next: String
  }
`;
