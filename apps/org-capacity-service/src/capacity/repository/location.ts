import { User } from '../../common';
import { LocationEntity } from '../model';

export interface LocationRepository {
  getLocation(user: User, id: string): Promise<LocationEntity>
  save(location: LocationEntity): Promise<LocationEntity>
}
