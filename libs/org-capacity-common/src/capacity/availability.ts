export interface AvailabilityStatusType {
  id: string
  name: string
  planned: boolean
  capacity: number
}

export interface AvailabilityStatus {
  typeId: string
  capacity: number
  start: Date
  plannedEnd?: Date
}
