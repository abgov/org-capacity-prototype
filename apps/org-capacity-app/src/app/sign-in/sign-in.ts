import { connect } from 'react-redux';
import { SignIn as SignInComponent } from './sign-in.component';
import { AppState } from '../../types';
import { loginUser } from '../../state';

export const SignIn = connect(
  (state: AppState) =>({
    profile: state.user.profile
  }),
  (dispatch) => ({
    onSignIn: () => dispatch(loginUser())
  })
)(SignInComponent);
