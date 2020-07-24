import { Model, Document, model, mongo } from 'mongoose';
import { User } from '@org-capacity/org-capacity-common';
import { Doc } from '../common';
import { LocationRepository, LocationEntity, Location } from '../capacity';
import { locationSchema } from './schema';

export class MongoLocationRepository implements LocationRepository {
  private model: Model<Document>;

  constructor() {
    this.model = model('location', locationSchema);
  }

  getLocation(user: User, id: string) {
    return new Promise<LocationEntity>((resolve, reject) => {
      this.model.findOne({ _id: id }, null, { lean: true }).exec((err, doc: Doc<Location>) => {
        if (err) { 
          reject(err);
        } else {
          const entity = this.fromDoc(doc);
          resolve((entity && entity.canAccess(user)) ? entity : null);
        }
      })
    });
  }

  save(person: LocationEntity) {
    return new Promise<LocationEntity>((resolve, reject) => {
      this.model.findOneAndUpdate({ _id: person.id || new mongo.ObjectId() }, this.toDoc(person), 
        { upsert: true, new: true, lean: true }, 
        (err, doc: unknown) => err ? 
          reject(err): 
          resolve(
            this.fromDoc(doc as Doc<Location>)
          )
      );
    });
  }

  private fromDoc(doc: Doc<Location>) {
    return doc ? new LocationEntity(this, {
      id: `${doc._id}`,
      fullAddress: doc.fullAddress
    }) : null;
  }

  private toDoc(entity: LocationEntity) {
    const doc: Doc<Location> = {
      fullAddress: entity.fullAddress
    }
    return doc;
  }
}
