import { 
  RequestContext, 
  User, 
  InvalidOperationError,
  UnauthorizedError 
} from '../../common';
import { Organization, Role, Person, NewOrganization, AvailabilityStatusType } from '../types';
import { Repositories } from '../repository';
import { OrganizationEntity, LocationEntity, PersonEntity } from '../model';

const importOrganization = (
  repos: Repositories, 
  user: User,
  parent: OrganizationEntity,
  defaultStatusType: AvailabilityStatusType,
  {location, roles, children, ...org}: NewOrganization
) => {
  const locationPromise = location ?
    LocationEntity.create(user, repos.location, location)
      .then(l => l.id) :
    Promise.resolve(null)

  return locationPromise.then((locationId: string) => {

    const newRolesPromises = (roles || []).map(({assigned, ...role}) => {
      if (!assigned) {
        return Promise.resolve({...role, assignedId: null})
      } else {
        const personLocationPromise = assigned.location ?
          LocationEntity.create(user, repos.location, assigned.location)
            .then(l => l.id) :
          Promise.resolve(null)
        
        return personLocationPromise.then((pLocationId) => 
          PersonEntity.create(
            user, 
            repos.person, 
            {
              ...assigned,
              availability: { 
                typeId: defaultStatusType.id, 
                start: new Date(),
                capacity: defaultStatusType.capacity
              }, 
              locationId: pLocationId
            }
          )
        ).then((person) => ({...role, assignedId: person.id}));
      }
    })

    return Promise.all(newRolesPromises)
      .then((newRoles) => 
        OrganizationEntity.create(
          user, 
          repos.organization, 
          {
            ...org, 
            parentId: parent ? 
              parent.id : null, 
            locationId, 
            roles: newRoles
          }
        )
      ).then((newOrg) => {
        return children ? 
          Promise.all(
            children.map(child => 
              importOrganization(repos, user, newOrg, defaultStatusType, child)
            )
          ).then(() =>newOrg) :
          Promise.resolve(newOrg)
      });
  });
}

export const createOrganizationResolvers = (repos: Repositories) => ({
  Person: {
    location: (obj: Person, _: object, context: RequestContext) => obj.locationId ? 
      repos.location.getLocation(context.user, obj.locationId) :
      null
  },
  Role: {
    assigned: (obj: Role, _: object, context: RequestContext) => obj.assignedId ? 
      repos.person.getPerson(context.user, obj.assignedId) :
      null
  },
  Organization: {
    parent: (
      obj: Organization, 
      _: object, 
      context: RequestContext
    ) => (obj && obj.parentId) ? 
      repos.organization.getOrganization(context.user, obj.parentId) :
      Promise.resolve(null)
    ,
    children: (
      obj: Organization, 
      _: object, 
      context: RequestContext
    ) => (obj && obj.id) ?
      repos.organization.getOrganizations(
        context.user, 2000, null, { parentEquals: obj.id}
      ).then(r => r.results):
      Promise.resolve(null)
    ,
    location: (
      obj: Organization, 
      _: object, 
      context: RequestContext
    ) => (obj && obj.locationId) ? 
      repos.location.getLocation(context.user, obj.id) :
      Promise.resolve(null)
    ,
    capacity: (
      obj: Organization, 
      _: object, 
      context: RequestContext
    ) => {

      if (!context.user) {
        throw new UnauthorizedError('User not permitted to access capacity.');
      }

      return repos.organization.computeCapacity(context.user, obj.id);
    }
  },
  Query: {
    organizations: (
      _, 
      {top, after, criteria}, 
      context: RequestContext
    ) => repos.organization.getOrganizations(context.user, top, after, criteria),
    
    organization: (
      _, 
      {id}, 
      context: RequestContext
    ) => repos.organization.getOrganization(context.user, id)
  },
  Mutation: {
    importOrganization: (
      _, 
      {parentId, defaultStatusTypeId, org}, 
      context: RequestContext
    ) => (parentId ? 
      repos.organization.getOrganization(context.user, parentId)
      .then((parent) => {
        if (!parent) {
          throw new InvalidOperationError(`Parent organization (ID: ${parentId}) not found.`);
        }
        return parent;
      }) : 
      Promise.resolve<OrganizationEntity>(null)
    ).then((parent) =>
      repos.availability.getStatusType(
        defaultStatusTypeId
      ).then(
        (statusType) => ({parent, statusType})
      )
    ).then(({parent, statusType}) => 
      importOrganization(repos, context.user, parent, statusType, org)
    ),
    updateOrganization: (
      _, 
      {organizationId, update}, 
      context: RequestContext
    ) => repos.organization.getOrganization(context.user, organizationId)
      .then((org) => 
        org.update(context.user, update)
      ),
    updateOrganizationRoles: (
      _,
      {organizationId, roles},
      context: RequestContext
    ) => repos.organization.getOrganization(context.user, organizationId)
      .then((org) => 
        org.updateRoles(context.user, roles)
      )
      .then((entity) => {
        repos.organization.clearCache(organizationId);
        return entity;
      }),
    deleteOrganizationRole: (
      _,
      {organizationId, roleId},
      context: RequestContext
    ) => repos.organization.getOrganization(context.user, organizationId)
      .then((org) => 
        org.deleteRole(context.user, roleId)
      )
      .then((entity) => {
        repos.organization.clearCache(organizationId);
        return entity;
      })
  }
})
