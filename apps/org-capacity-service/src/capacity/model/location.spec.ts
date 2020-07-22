import { LocationEntity } from './location';
import { LocationRepository } from '../repository';
import { UserRole, UnauthorizedError } from '../../common';

describe('LocationEntity', () => {

  it('can be created from record', () => {
    const entity = new LocationEntity(
      {} as unknown as LocationRepository, 
      { 
        id: '1', 
        fullAddress: '123 Test Ave'
      }
    );

    expect(entity).toBeTruthy();
    expect(entity.id).toEqual('1');
    expect(entity.fullAddress).toEqual('123 Test Ave');
  });

  it('can be created from new', () => {
    const entity = new LocationEntity(
      {} as unknown as LocationRepository, 
      { 
        fullAddress: '123 Test Ave'
      }
    );

    expect(entity).toBeTruthy();
    expect(entity.id).toBeFalsy();
    expect(entity.fullAddress).toEqual('123 Test Ave');
  });
  
  describe('create', () => {
    it('can create', (done) => {
      const mockSave = jest.fn(
        (location: LocationEntity) => Promise.resolve(location)
      );
  
      LocationEntity.create({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, {
        save: mockSave
      } as unknown as LocationRepository, {
        fullAddress: '123 Test Ave'
      }).then(
        (entity) => {
      
          expect(entity).toBeTruthy();
          expect(entity.fullAddress).toEqual('123 Test Ave');
          done();
        }
      ).catch((err) => done(err));
    });
  
    it('can fail for user without role.', () => {
      
      expect(() => {
        LocationEntity.create({
          id: '1', 
          name: 'testy',
          email: 'testy@testco.org',
          organizationId: '',
          roles: []
        }, { } as unknown as LocationRepository, {
          fullAddress: '123 Test Ave'
        });
      }).toThrowError(UnauthorizedError);
    });
  });
  
  describe('canAccess', () => {
    it('can return true for user', () => {
      const entity = new LocationEntity(
        {} as unknown as LocationRepository, 
        { 
          id: '1', 
          fullAddress: '123 Test Ave'
        }
      );

      const canAccess = entity.canAccess({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      });

      expect(canAccess).toEqual(true);
    });

    it('can return false for no user', () => {
      const entity = new LocationEntity(
        {} as unknown as LocationRepository, 
        { 
          id: '1', 
          fullAddress: '123 Test Ave'
        }
      );

      const canAccess = entity.canAccess(null);
      expect(canAccess).toEqual(false);
    });
  })
});
