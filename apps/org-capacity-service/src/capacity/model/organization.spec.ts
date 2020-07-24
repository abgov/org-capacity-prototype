import { OrganizationEntity } from './organization';
import { OrganizationRepository } from '../repository';
import { UserRole } from '@org-capacity/org-capacity-common';
import { UnauthorizedError } from '../../common';

describe('OrganizationEntity', () => {
  
  it('can be created from record', () => {
    const entity = new OrganizationEntity(
      {} as unknown as OrganizationRepository, 
      { 
        id: '1', 
        name: 'Test Co',
        type: 'test',
        roles: []
      }
    );

    expect(entity).toBeTruthy();
    expect(entity.id).toEqual('1');
    expect(entity.name).toEqual('Test Co');
    expect(entity.type).toEqual('test');
    expect(entity.roles).toEqual([]);
  });

  describe('create', () => {
    it('can create', (done) => {
      const mockSave = jest.fn(
        (organization: OrganizationEntity) => Promise.resolve({
          id: '1', 
          ...organization
        })
      );
  
      OrganizationEntity.create({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, {
        save: mockSave
      } as unknown as OrganizationRepository, {
        name: 'Test Co',
        type: 'test',
        roles: []
      }).then(
        (entity) => {
      
          expect(entity).toBeTruthy();
          expect(entity.id).toEqual('1');
          expect(entity.name).toEqual('Test Co');
          expect(entity.type).toEqual('test');
          expect(entity.roles).toEqual([]);
          done();
        }
      ).catch((err) => done(err));
    });
  });

  describe('updateRoles', () => {
    it('can update roles', (done) => {
      const entity = new OrganizationEntity(
        {
          save: jest.fn(
            (organization: OrganizationEntity) => Promise.resolve(organization)
          )
        } as unknown as OrganizationRepository, 
        { 
          id: '1', 
          name: 'Test Co',
          type: 'test',
          roles: []
        }
      );

      entity.updateRoles({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, [
        {
          name: 'Tester'
        }
      ]).then((result) => {

        expect(result.roles).toContainEqual({
          name: 'Tester'
        });
        done();
      }).catch(err => done(err));
    });
    
    it('can allow org-admin of organization', (done) => {
      const entity = new OrganizationEntity(
        {
          save: jest.fn(
            (organization: OrganizationEntity) => Promise.resolve(organization)
          )
        } as unknown as OrganizationRepository, 
        { 
          id: '1', 
          name: 'Test Co',
          type: 'test',
          roles: []
        }
      );

      entity.updateRoles({
        id: 'user-1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '1',
        roles: [UserRole.OrganizationAdmin]
      }, [
        {
          name: 'Tester'
        }
      ]).then((result) => {

        expect(result.roles).toContainEqual({
          name: 'Tester'
        });
        done();
      }).catch(err => done(err))
    });

    it('can prevent user without role', () => {
      const entity = new OrganizationEntity(
        {
          save: jest.fn(
            (organization: OrganizationEntity) => Promise.resolve(organization)
          )
        } as unknown as OrganizationRepository, 
        { 
          id: '1', 
          name: 'Test Co',
          type: 'test',
          roles: []
        }
      );

      expect(() => {
        entity.updateRoles({
          id: '1', 
          name: 'testy',
          email: 'testy@testco.org',
          organizationId: '',
          roles: []
        }, [
          {
            name: 'Tester'
          }
        ]);
      }).toThrowError(UnauthorizedError);
    });
  });

  describe('deleteRole', () => {
    it('can delete role', (done) => {
      const entity = new OrganizationEntity(
        {
          save: jest.fn(
            (organization: OrganizationEntity) => Promise.resolve(organization)
          )
        } as unknown as OrganizationRepository, 
        { 
          id: '1', 
          name: 'Test Co',
          type: 'test',
          roles: [{
            id: '1',
            name: 'Tester'
          }]
        }
      );

      entity.deleteRole({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, '1').then((result) => {

        expect(result.roles).toEqual([]);
        done();
      }).catch(err => done(err))
    });
  });
});
