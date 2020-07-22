import { Action } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { switchMap, map, debounceTime, withLatestFrom, filter } from 'rxjs/operators';
import { USER_EXPIRED, USER_FOUND } from 'redux-oidc';
import { UserManager } from 'oidc-client';
import { push } from 'connected-react-router';
import { AppState } from '../../types';
import { USER_LOGIN, USER_LOGOUT } from '../actions';

interface UserEpics {
  loginUserEpic: Epic
  logoutUserEpic: Epic
  loginRedirectEpic: Epic
}

interface UserEpicsProps {
  signinPath?: string
  redirectFrom?: (path: string) => boolean
}

export const createUserEpics: (props: UserEpicsProps, userManager: UserManager) => UserEpics = 
({signinPath, redirectFrom}, userManager) => {

  signinPath = signinPath || '/signin';

  return {
    loginUserEpic: (action$) => action$.pipe(
      ofType(USER_LOGIN),
      switchMap(() => {
        userManager.signinRedirect();
        return of();
      })
    ),
    logoutUserEpic: (action$) => action$.pipe(
      ofType(USER_LOGOUT),
      switchMap(() => {
        userManager.removeUser();
        return of(push(signinPath));
      })
    ),
    loginRedirectEpic: (action$, state$) => action$.pipe(
      ofType(USER_EXPIRED, USER_FOUND),
      debounceTime(2000),
      withLatestFrom(state$),
      filter(([_, s]: [Action, AppState]) => 
        !s.user.token && 
        s.router.location.pathname !== signinPath && (
          !redirectFrom ||
          redirectFrom(s.router.location.pathname)
        )
      ),
      map(() => push(signinPath))
    )
  }
}
