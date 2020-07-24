import { Model, Document, model, mongo } from 'mongoose';
import { User } from '@org-capacity/org-capacity-common';
import { Doc } from '../common';
import { AvailabilityRepository, AvailabilityStatusType } from '../capacity';
import { availabilityStatusTypeSchema } from './schema';

export class MongoAvailabilityRepository implements AvailabilityRepository {
  private model: Model<Document>;

  constructor() {
    this.model = model('availabilityStatusType', availabilityStatusTypeSchema);
  }

  getStatusTypes() {
    return new Promise<AvailabilityStatusType[]>((resolve, reject) => {
      this.model.find({}, null, { lean: true })
      .exec(
        (err, docs: Doc<AvailabilityStatusType>[]) => err ? 
          reject(err) : 
          resolve(docs.map(doc => this.fromDoc(doc)))
      );
    });
  }

  getStatusType(id: string) {
    return new Promise<AvailabilityStatusType>((resolve, reject) => {
      this.model.findOne({ _id: id }, null, { lean: true })
      .exec(
        (err, doc: Doc<AvailabilityStatusType>) => err ? 
          reject(err) : 
          resolve(this.fromDoc(doc))
      );
    });
  }
  
  saveTypes(_: User, types: AvailabilityStatusType[]) {
    const typePromises = types.map(type => 
      new Promise<AvailabilityStatusType>((resolve, reject) => {
        this.model.findOneAndUpdate({ _id: type.id || new mongo.ObjectId() }, this.toDoc(type), 
          { upsert: true, new: true, lean: true }, 
          (err, doc: unknown) => err ? 
            reject(err): 
            resolve(
              this.fromDoc(
                doc as Doc<AvailabilityStatusType>
              )
            )
        );
      }))

    return Promise.all(typePromises);
  }

  private fromDoc(doc: Doc<AvailabilityStatusType>) {
    return doc ? {
      id: `${doc._id}`,
      name: doc.name,
      planned: doc.planned,
      capacity: doc.capacity
    } : null;
  }

  private toDoc(entity: AvailabilityStatusType) {
    const doc: Doc<AvailabilityStatusType> = {
      name: entity.name,
      planned: entity.planned,
      capacity: entity.capacity
    }
    return doc;
  }
}
