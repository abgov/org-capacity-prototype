import { Results } from '@org-capacity/org-capacity-common';
import { User } from '../../common';
import { PersonEntity } from '../model';
import { PersonCriteria } from '../types';

export interface PersonRepository {
  getPersons(
    user: User, top: number, after?: string, criteria?: PersonCriteria
  ): Promise<Results<PersonEntity>>
  
  getPerson(user: User, id: string): Promise<PersonEntity>

  save(entity: PersonEntity): Promise<PersonEntity>
}
