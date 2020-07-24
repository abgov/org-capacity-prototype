import { PersonEntity } from './person';
import { PersonRepository } from '../repository';
import { UserRole } from '@org-capacity/org-capacity-common';

describe('PersonEntity', () => {

  it('can be created from record', () => {
    const entity = new PersonEntity(
      {} as unknown as PersonRepository, 
      { 
        id: '1', 
        firstName: 'Testy',
        lastName: 'McTester',
        middleName: 'T.',
        phone: null,
        fax: null
      }
    );

    expect(entity).toBeTruthy();
    expect(entity.id).toEqual('1');
    expect(entity.firstName).toEqual('Testy');
    expect(entity.lastName).toEqual('McTester');
    expect(entity.middleName).toEqual('T.');
    expect(entity.phone).toBeNull();
    expect(entity.fax).toBeNull();
  });
  
  describe('create', () => {
    it('can create', (done) => {
      const mockSave = jest.fn(
        (person: PersonEntity) => Promise.resolve({
          id: '1', 
          ...person
        })
      );
  
      PersonEntity.create({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, {
        save: mockSave
      } as unknown as PersonRepository, {
        firstName: 'Testy',
        lastName: 'McTester',
        middleName: 'T.',
        phone: null,
        fax: null
      }).then((entity) => {
        expect(entity).toBeTruthy();
        expect(entity.id).toEqual('1');
        expect(entity.firstName).toEqual('Testy');
        expect(entity.lastName).toEqual('McTester');
        expect(entity.middleName).toEqual('T.');
        expect(entity.phone).toBeNull();
        expect(entity.fax).toBeNull();

        done();
      }).catch((err) => done(err));
    });
  });

  describe('setAvailability', () => {
    it('can set availability', (done) => {
      const entity = new PersonEntity(
        {
          save: jest.fn(
            (person: PersonEntity) => Promise.resolve(person)
          )
        } as unknown as PersonRepository, 
        { 
          id: '1', 
          firstName: 'Testy',
          lastName: 'McTester',
          middleName: 'T.',
          phone: null,
          fax: null
        }
      );
  
      const start = new Date();
      entity.setAvailability({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, {
        id: 'status-1',
        name: 'Available',
        capacity: 100,
        planned: true
      }, {
        capacity: 100,
        start
      }).then((result) => {
  
        expect(result.availability).toBeTruthy();
        expect(result.availability.typeId).toEqual('status-1');
        expect(result.availability.capacity).toEqual(100);
        expect(result.availability.start).toEqual(start);
        done();
      });
    });
  });
});
