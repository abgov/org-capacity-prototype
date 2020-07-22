import { UserRole } from '@org-capacity/org-capacity-common';
import { AssertRole } from './assert';
import { User } from './user';
import { UnauthorizedError } from './errors';

class Dummy {
  next: string = null;

  @AssertRole('check role', UserRole.OrganizationAdmin)
  checkRole(user: User, next: string) {
    this.next = next;
  }
}

describe('AssertRole', () => {
  let dummy: Dummy = null;
  
  beforeEach(() => {
    dummy = new Dummy();
  });

  it('can accept user with role', () => {
    dummy.checkRole({
      id: '1', 
      name: 'testy',
      email: 'testy@testco.org',
      organizationId: '',
      roles: [UserRole.OrganizationAdmin]
    }, 'test');

    expect(dummy.next).toEqual('test');
  });

  it('can fail user without role', () => {
    expect(() => {
      dummy.checkRole({
        id: '1', 
        name: 'testy',
        email: 'testy@testco.org',
        organizationId: '',
        roles: [UserRole.ServiceAdmin]
      }, 'test');
    }).toThrowError(UnauthorizedError);
  });
});
