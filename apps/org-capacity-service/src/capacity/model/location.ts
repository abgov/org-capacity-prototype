import { 
  AssertRole, 
  New, 
  User, 
  UserRole 
} from '../../common';
import { logger } from '../../logger';
import { Location } from '../types';
import { LocationRepository } from '../repository';

export class LocationEntity implements Location {
  public id: string;
  public fullAddress: string;

  @AssertRole('create location', [UserRole.ServiceAdmin])
  static async create(creator: User, repository: LocationRepository, location: New<Location>) {

    const entity = new LocationEntity(repository, location);
    return repository.save(entity)
      .then((result) => {
        logger.info(
          `Location '${result.fullAddress}' (ID: ${result.id}) created by ` + 
          `user '${creator.name}' (ID: ${creator.id}).`);
        return result;
      });
  }

  constructor(private repository: LocationRepository, location: New<Location> | Location) {
    
    this.fullAddress = location.fullAddress;

    const record = (location as Location);
    if (record.id) {
      this.id = record.id;
    }
  }

  canAccess(user: User) {
    return !!user;
  }
}
