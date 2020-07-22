import { AvailabilityStatusType } from '@org-capacity/org-capacity-common';

export interface AvailabilityState {
  types: {
    [id: string]: AvailabilityStatusType
  },
  results: string[]
}
