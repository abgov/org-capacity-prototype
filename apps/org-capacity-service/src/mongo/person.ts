import { Model, Document, model, mongo } from 'mongoose';
import { Results, User } from '@org-capacity/org-capacity-common';
import { decodeAfter, encodeNext, Doc} from '../common';
import { PersonRepository, PersonEntity, Person, PersonCriteria } from '../capacity';
import { personSchema } from './schema';

export class MongoPersonRepository implements PersonRepository {
  private model: Model<Document>;

  constructor() {
    this.model = model('person', personSchema);
  }

  getPersons(user: User, top: number, after?: string, criteria?: PersonCriteria) {
    
    const skip = decodeAfter(after);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}
    if (criteria) {
      if (criteria.nameContains) {
        query.$or = [
          { firstName: new RegExp(criteria.nameContains, 'i') },
          { lastName: new RegExp(criteria.nameContains, 'i') }
        ]
      }
    }

    return new Promise<Results<PersonEntity>>((resolve, reject) => {
      this.model.find(query, null, { lean: true })
      .limit(top)
      .skip(skip)
      .exec((err, docs: Doc<Person>[]) => {
        if (err) { 
          reject(err);
        } else {
          const results = docs.map(doc => this.fromDoc(doc))
            .filter(entity => entity.canAccess(user));
          resolve({
            results,
            page: {
              after,
              size: results.length,
              next: encodeNext(docs.length, top, skip)
            }
          });
        }
      });
    });
  }

  getPerson(user: User, id: string) {
    return new Promise<PersonEntity>((resolve, reject) => {
      this.model.findOne({ _id: id }, null, { lean: true }).exec((err, doc: Doc<Person>) => {
        if (err) { 
          reject(err);
        } else {
          const entity = this.fromDoc(doc);
          resolve((entity && entity.canAccess(user)) ? entity : null);
        }
      })
    });
  }

  save(person: PersonEntity) {
    return new Promise<PersonEntity>((resolve, reject) => {
      this.model.findOneAndUpdate({ _id: person.id || new mongo.ObjectId() }, this.toDoc(person), 
        { upsert: true, new: true, lean: true }, 
        (err, doc: unknown) => err ? 
          reject(err): 
          resolve(this.fromDoc(doc as Doc<Person>))
      );
    });
  }

  private fromDoc(doc: Doc<Person>) {
    return doc ? new PersonEntity(this, {
      id: `${doc._id}`,
      firstName: doc.firstName,
      lastName: doc.lastName,
      middleName: doc.middleName,
      phone: doc.phone,
      fax: doc.fax,
      locationId: doc.locationId,
      availability: doc.availability
    }) : null;
  }

  private toDoc(entity: PersonEntity) {
    const doc: Doc<Person> = {
      firstName: entity.firstName,
      lastName: entity.lastName,
      middleName: entity.middleName,
      phone: entity.phone,
      fax: entity.fax,
      locationId: entity.locationId,
      availability: entity.availability
    }

    return doc;
  }
}
