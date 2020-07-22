import { Person as BasePerson } from '@org-capacity/org-capacity-common';
import { New } from '../../common';
import { Location } from './location';

export interface Person extends BasePerson {
  locationId?: string
}

export type NewPerson = Pick<Person, Exclude<keyof Person, 'id' | 'locationId' | 'availability'>> & {
  location?: New<Location>
}
