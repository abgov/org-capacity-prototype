import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { AppState } from '../../types';
import { logoutUser } from '../../state';

import AppHeaderComponent from './app-header.component';

export const AppHeader = connect(
  (state: AppState) => ({ 
    profile: state.user.profile
  }),
  (dispatch, ownProps: {signinPath?: string}) => ({
    onLogin: () => dispatch(push(ownProps.signinPath || '/signin')),
    onLogout: () => dispatch(logoutUser()),
    onOpenProfile: () => dispatch(push('/profile'))
  })
)(AppHeaderComponent);
