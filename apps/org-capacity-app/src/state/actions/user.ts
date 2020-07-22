export const USER_LOGIN = 'USER/USER_LOGIN';
export const USER_LOGOUT = 'USER/USER_LOGOUT';

export interface UserLoginAction {
  type: typeof USER_LOGIN
}

export interface UserLogoutAction {
  type: typeof USER_LOGOUT
}

export const loginUser = (): UserLoginAction => ({
  type: USER_LOGIN
})

export const logoutUser = (): UserLogoutAction => ({
  type: USER_LOGOUT
})

export type UserActionTypes =
  UserLoginAction | UserLogoutAction
