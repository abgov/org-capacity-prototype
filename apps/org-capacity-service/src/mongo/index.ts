import { connect } from 'mongoose';
import * as NodeCache from 'node-cache';
import { Repositories } from '../capacity';
import { MongoOrganizationRepository } from './organization';
import { MongoPersonRepository } from './person';
import { MongoLocationRepository } from './location';
import { MongoAvailabilityRepository } from './availability';

interface RepositoryProps {
  MONGO_URI: string
  MONGO_DB: string
  MONGO_USER: string
  MONGO_PASSWORD: string
}

export const createRepositories = ({
  MONGO_URI, 
  MONGO_DB, 
  MONGO_USER, 
  MONGO_PASSWORD
}: RepositoryProps): Promise<Repositories> => new Promise(
(resolve, reject) => {

  connect(`${MONGO_URI}/${MONGO_DB}`,
    { 
      user: MONGO_USER, 
      pass: MONGO_PASSWORD, 
      useNewUrlParser: true, 
      useFindAndModify: false, 
      useUnifiedTopology: true
    }, 
    (err) => {
      if (err) {
        reject(err);
      } else {
        const cache = new NodeCache({ stdTTL: 86400 });
        
        resolve(({
          availability: new MongoAvailabilityRepository(),
          location: new MongoLocationRepository(),
          person: new MongoPersonRepository(),
          organization: new MongoOrganizationRepository(cache)
        }));
      }
    }
  );
});
