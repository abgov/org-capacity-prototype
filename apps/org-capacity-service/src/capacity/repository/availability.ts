
import { User } from '@org-capacity/org-capacity-common';
import { AvailabilityStatusType } from '../types';

export interface AvailabilityRepository {
  getStatusTypes(): Promise<AvailabilityStatusType[]>
  getStatusType(id: string): Promise<AvailabilityStatusType>
  saveTypes(user: User, types: AvailabilityStatusType[]): Promise<AvailabilityStatusType[]>
}
