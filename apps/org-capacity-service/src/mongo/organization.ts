import { Model, Document, model, Types } from 'mongoose';
import * as NodeCache from 'node-cache';
import { Results, User } from '@org-capacity/org-capacity-common';
import { decodeAfter, encodeNext, Doc } from '../common';
import { 
  OrganizationRepository, 
  Organization, 
  OrganizationCriteria, 
  OrganizationEntity, 
  Role, 
  OrganizationCapacity 
} from '../capacity';
import { organizationSchema, organizationHierarchySchema } from './schema';
import { logger } from '../logger';
import { OrganizationHierarchy } from './types';

type OrganizationDoc = 
  Pick<Organization, Exclude<keyof Organization, 'id' | 'capacity' | 'roles'>> & {
    _id: Types.ObjectId,
    roles: Doc<Role>[]
  }

export class MongoOrganizationRepository implements OrganizationRepository {
  private model: Model<Document>;
  private hierarchyModel: Model<Document>;

  constructor(private cache: NodeCache) {
    this.model = model('organization', organizationSchema);
    this.hierarchyModel = model('organizationHierarchy', organizationHierarchySchema);
  }

  getOrganizations(user: User, top: number, after: string, criteria: OrganizationCriteria) {
    const skip = decodeAfter(after);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (criteria) {
      if (criteria.idEquals) {
        query._id = criteria.idEquals;
      }
      
      if (criteria.typeEquals) {
        query.type = criteria.typeEquals;
      }

      if (criteria.parentEquals) {
        query.parentId = criteria.parentEquals;
      }

      if (criteria.nameContains) {
        query.name = { $regex: new RegExp(`${criteria.nameContains}`, 'gi') }
      }

      // if (criteria.includesAssigned) {
      //   query.roles = {
      //     assignedId: criteria.includesAssigned
      //   }
      // }
    }

    return new Promise<Results<OrganizationEntity>>((resolve, reject) => {
      this.model.find(query, null, { lean: true })
      .skip(skip)
      .limit(top)
      .exec(
        (err, docs: OrganizationDoc[]) => err ? reject(err) : resolve({
          results: docs.map(doc => this.fromDoc(doc)).filter(e => e.canAccess(user)),
          page: {
            after,
            next: encodeNext(docs.length, top, skip),
            size: docs.length
          }
        })
      );
    });
  }

  getOrganization(user: User, id: string) {
    return new Promise<OrganizationEntity>((resolve, reject) => {
      this.model.findOne({ _id: id }, null, { lean: true })
        .exec((err, doc: OrganizationDoc) => {
          if (err) { 
            reject(err);
          } else {
            const entity = this.fromDoc(doc);
            resolve((entity && entity.canAccess(user)) ? entity : null);
          }
        });
    });
  }

  computeCapacity(user: User, id: string) {

    const cachedCapacity: OrganizationCapacity = this.cache.get(id);
    
    const pipeline = [
      { $match: { aboveId: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'organizations',
          localField: 'belowId',
          foreignField: '_id',
          as: 'descendants'
        }
      },
      {
        $unwind: '$descendants'
      },
      {
        $project: { 
          roles: '$descendants.roles' 
        }
      },
      {
        $unwind: '$roles'
      },
      {
        $lookup: {
          from: 'people',
          localField: 'roles.assignedId',
          foreignField: '_id',
          as: 'assigned'
        }
      },
      {
        $unwind: { 
          path: '$assigned',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: { 
          availability: {
            $ifNull: [
              '$assigned.availability',
              { $literal: { typeId: null, capacity: 0} }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$availability.typeId',
          count: { $sum: 1 },
          capacity: { 
            $sum: '$availability.capacity'
          }
        }
      }
    ];

    return cachedCapacity ? 
      Promise.resolve(cachedCapacity) : 
      new Promise<OrganizationCapacity>((resolve, reject) => {
        this.hierarchyModel.aggregate(pipeline)
        .exec((err, docs) => {
          if (err) { 
            reject(err);
          } else {
            const capacity: OrganizationCapacity = {
              capacity: 0,
              totalRoles: 0,
              vacantRoles: 0,
              statusCounts: []
            }

            let capacitySum = 0;
            docs.forEach(doc => {
              capacity.totalRoles += doc.count;
              capacitySum += doc.capacity;

              if (!doc._id) {
                capacity.vacantRoles = doc.count;
              } else {
                capacity.statusCounts.push({
                  typeId: `${doc._id}`,
                  count: doc.count
                })
              }
            })

            capacity.capacity = capacitySum / capacity.totalRoles;
            this.cache.set(id, capacity);
            resolve(capacity);
          }
        });
      }).then((capacity) => {
        logger.info(`Computed capacity of organization (ID: ${id}) from pipeline.`);
        return capacity;
      });
  }

  clearCache(id: string) {
    return new Promise<void>((resolve, reject) => 
      this.hierarchyModel.find({belowId: id}, (err, res: OrganizationHierarchy[]) => {
        
        if (err) {
          reject(err);
        } else {
          const orgIds = res.map(r => r.aboveId);
          this.cache.del(orgIds.map(orgId => `${orgId}`));
          logger.info(
            `Cleared computed capacity of organizations (IDs: ${orgIds.join(', ')}) from cache.`
          );
          resolve();
        }
      })
    );
  }

  save(entity: OrganizationEntity) {
    return new Promise<OrganizationEntity>((resolve, reject) => {
      this.model.findOneAndUpdate(
        { _id: entity.id || new Types.ObjectId() }, 
        this.toDoc(entity), 
        { upsert: true, new: true, lean: true, rawResult: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err, res: any) => {
          
          if (err) {
            reject(err) 
          } 
          else if (!res.lastErrorObject.updatedExisting) {
            resolve(
              this.attachToHierarch(entity.parentId, res.value._id)
                .then(() => this.fromDoc(res.value))
            );
          } 
          else {
            resolve(this.fromDoc(res.value))
          }
        })
    });
  }

  private attachToHierarch(parentId: string, newId: string) {

    return new Promise((resolve, reject) => 
      this.hierarchyModel.find(
        {belowId: parentId}, 
        (err, res: OrganizationHierarchy[]) => {
        
          if (err) {
            reject(err);
          } else {
            const relations = res.map(r => 
              ({level: r.level + 1, aboveId: r.aboveId, belowId: newId}));
            relations.push({level: 0, aboveId: newId, belowId: newId});
            
            this.hierarchyModel.insertMany(relations, 
              (ierr) => ierr ? reject(ierr) : resolve()
            );
          }
        }
      )
    );
  }

  private toDoc(entity: OrganizationEntity) {
    return {
      type: entity.type,
      name: entity.name,
      parentId: entity.parentId,
      locationId: entity.locationId,
      roles: entity.roles.map(r => ({
        _id: r.id,
        name: r.name,
        assignedId: r.assignedId
      }))
    }
  }

  private fromDoc(doc: OrganizationDoc) {
    const entity: OrganizationEntity = doc ? 
      new OrganizationEntity(this, {
        id: `${doc._id}`,
        type: doc.type,
        name: doc.name,
        parentId: doc.parentId,
        locationId: doc.locationId,
        roles: doc.roles.map(r => ({
          id: `${r._id}`,
          name: r.name,
          assignedId: r.assignedId
        }))
      }) : 
      null;

    return entity;
  }
}
