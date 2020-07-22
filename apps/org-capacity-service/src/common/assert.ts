// Passport enhances type defs on express types; this is needed for type checking on tests.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as passport from 'passport';
import { UnauthorizedError } from './errors';
import { UserRole, User } from './user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionWithUser = (user: User, ...args: unknown[]) => any

type AssertRole = (operation: string, roles: UserRole | UserRole[]) => 
  (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<FunctionWithUser>) => 
  TypedPropertyDescriptor<FunctionWithUser>

export const AssertRole: AssertRole = (operation, roles) => 
(target, propertyKey, descriptor) => {

  const method = descriptor.value;
  descriptor.value = (function(user: User, ...args: unknown[]) {

    if (!(roles instanceof Array)) {
      roles = [ roles ];
    }

    const userRoles: UserRole[] = (user && user.roles) || [];
    // If user has at least one of the roles, then they are permitted.
    const matchedRoles = roles.filter(required => userRoles.includes(required));

    if (matchedRoles.length === 0) {
      throw new UnauthorizedError(`User not permitted to ${operation}.`);
    } else {
      return method.apply(this, [user, ...args]);
    }
  });

  return descriptor;
}
