import { gql } from 'apollo-server-express';

export default gql`

  type AvailabilityStatusType {
    id: ID
    name: String
    planned: Boolean
    capacity: Int
  }
  
  type AvailabilityStatus {
    typeId: ID
    capacity: Int
    start: Date
    plannedEnd: Date
  }

  input AvailabilityStatusTypeUpdate {
    id: ID
    name: String
    planned: Boolean
    capacity: Int
  }

  input AvailabilityStatusUpdate {
    typeId: ID
    capacity: Int
    start: Date
    plannedEnd: Date
  }
`
