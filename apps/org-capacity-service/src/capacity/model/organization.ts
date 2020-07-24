import { UserRole, User } from '@org-capacity/org-capacity-common';
import { 
  AssertRole, 
  New, 
  Update, 
  InvalidOperationError, 
  UnauthorizedError 
} from '../../common';
import { 
  Organization,
  Role
} from '../types';
import { OrganizationRepository } from '../repository';
import { logger } from '../../logger';

export class OrganizationEntity implements Organization {
  public id: string;
  public type: string;
  public name: string;
  public parentId: string;
  public locationId: string;
  public roles: Role[];

  @AssertRole('create organization', [UserRole.OrganizationAdmin, UserRole.ServiceAdmin])
  static async create(
    creator: User, 
    repository: OrganizationRepository, 
    organization: New<Organization>
  ) {

    const entity = new OrganizationEntity(repository, organization);
    return repository.save(entity)
    .then(
      (result) => {
        logger.info(`Organization '${result.name}' (ID: ${result.id}) created by ` + 
          `user '${creator.name}' (ID: ${creator.id}).`);
        
        return result;
      }
    );
  }

  constructor(private repository: OrganizationRepository, organization: Organization | New<Organization>) {
    
    this.type = organization.type;
    this.name = organization.name;
    this.locationId = organization.locationId;
    this.parentId = organization.parentId;
    this.roles = organization.roles;

    const record = organization as Organization;
    if (record.id) {
      this.id = record.id;
    }
  }

  @AssertRole('update organization', [UserRole.ServiceAdmin])
  async update(updater: User, update: Update<Organization>) {

    if (update.name) {
      this.name = update.name;
    }

    if (update.type) {
      this.type = update.type;
    }

    if (update.parentId) {
      this.parentId = update.parentId;
    }
    
    return this.repository.save(this)
      .then((entity) => {
        logger.info(
          `Organization ${this.name} (ID: ${this.id}) updated by ` +
          `user ${updater.name} (ID: ${updater.id}).`
        );
        return entity;
      });
  }

  @AssertRole('update organization roles', [UserRole.OrganizationAdmin, UserRole.ServiceAdmin])
  async updateRoles(updater: User, roles: Role[]) {

    if (!updater.roles.includes(UserRole.ServiceAdmin) &&
      this.id !== updater.organizationId) {
      throw new UnauthorizedError(
        `User ${updater.name} (ID: ${updater.id}) not allowed to update roles for ` +
        `organization ${this.name} (ID: ${this.id}).`)
    }

    roles.forEach(ru => {
      if (ru.id) {
        const existing = this.roles.find(r => ru.id === r.id);
        if (!existing) {
          throw new InvalidOperationError(
            `Role (ID: ${ru.id}) not found on organization ${this.name} (ID: ${this.id}).`)
        }

        if (ru.name) {
          existing.name = ru.name;
        }
        existing.assignedId = ru.assignedId;
      } else {
        this.roles.push({
          name: ru.name, 
          assignedId: ru.assignedId
        });
      }
    });

    return this.repository.save(this)
      .then((entity) => {
        logger.info(
          `Roles of organization ${this.name} (ID: ${this.id}) updated by ` +
          `user ${updater.name} (ID: ${updater.id}).`
        );
        return entity;
      });
  }

  @AssertRole('delete organization role', [UserRole.OrganizationAdmin, UserRole.ServiceAdmin])
  async deleteRole(updater: User, roleId: string) {

    if (!updater.roles.includes(UserRole.ServiceAdmin) &&
      updater.organizationId !== this.id) {
      throw new UnauthorizedError(
        `User ${updater.name} (ID: ${updater.id}) not allowed to update roles for ` +
        `organization ${this.name} (ID: ${this.id}).`
      );
    }

    const rIdx = this.roles.findIndex(r => r.id === roleId);
    if (rIdx < 0) {
      throw new InvalidOperationError(
        `Role (ID: ${roleId}) not found on organization ${this.name} (ID: ${this.id}).`
      );
    }
    
    this.roles.splice(rIdx, 1);

    return this.repository.save(this)
      .then((entity) => {
        logger.info(
          `Roles of organization ${this.name} (ID: ${this.id}) updated by ` +
          `user ${updater.name} (ID: ${updater.id}).`
        );
        return entity;
      });
  }

  canAccess(user: User) {
    return !!user;
  }
}
