import { UserRole, User } from '@org-capacity/org-capacity-common';

export interface UserProfile extends User {
  avatar: string
  firstName: string
  lastName: string
  organization: string
}

export interface UserState {
  profile: UserProfile
  roles: (UserRole | string)[]
  token: string
}
