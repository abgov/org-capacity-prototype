import { AssertRole, New, User, UserRole } from '../../common';
import { logger } from '../../logger';
import { PersonRepository } from '../repository';
import { Person, AvailabilityStatus, AvailabilityStatusType } from '../types';

export class PersonEntity implements Person {
  public id: string;
  public firstName: string;
  public lastName: string;
  public middleName: string;
  public phone: string;
  public fax: string;
  public locationId: string;
  public availability: AvailabilityStatus;

  @AssertRole('create person', [UserRole.OrganizationAdmin, UserRole.ServiceAdmin])
  static async create(
    creator: User, 
    repository: PersonRepository, 
    person: New<Person>
  ) {

    const entity = new PersonEntity(repository, person);
    return repository.save(entity)
      .then((result) => {
        logger.info(
          `Person '${result.firstName} ${result.lastName}' (ID: ${result.id}) created by ` + 
          `user '${creator.name}' (ID: ${creator.id}).`);
        return result;
      });
  }

  constructor(private repository: PersonRepository, person: New<Person> | Person) {

    this.firstName = person.firstName;
    this.lastName = person.lastName;
    this.middleName = person.middleName;
    this.phone = person.phone;
    this.fax = person.fax;
    this.availability = person.availability;

    const record = (person as Person);
    if (record.id) {
      this.id = record.id;
    }
  }

  @AssertRole('set person availability', [UserRole.OrganizationAdmin, UserRole.ServiceAdmin])
  async setAvailability(
    updater: User, 
    type: AvailabilityStatusType, 
    availability: Omit<AvailabilityStatus, 'typeId'>
  ) {
    
    this.availability = {
      typeId: type.id,
      start: availability.start,
      capacity: availability.capacity,
      plannedEnd: availability.plannedEnd
    }
    
    return this.repository.save(this).then((entity) => {
      logger.info(
        `Person ${this.firstName} ${this.lastName} availability set to ${type.name} ` + 
        `by user '${updater.name}' (ID: ${updater.id}).`
      )
      return entity;
    });
  }

  canAccess(user: User) {
    return !!user;
  }
}
