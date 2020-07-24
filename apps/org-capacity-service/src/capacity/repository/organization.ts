import { Results, User } from '@org-capacity/org-capacity-common';
import { OrganizationCriteria, OrganizationCapacity } from '../types';
import { OrganizationEntity } from '../model';

export interface OrganizationRepository {
  getOrganizations(
    user: User,
    top: number, 
    after: string, 
    criteria: OrganizationCriteria
  ): Promise<Results<OrganizationEntity>>

  getOrganization(user: User, id: string): Promise<OrganizationEntity>

  computeCapacity(user: User, id: string): Promise<OrganizationCapacity>

  clearCache(id: string): Promise<void>

  save(entity: OrganizationEntity): Promise<OrganizationEntity>
}
