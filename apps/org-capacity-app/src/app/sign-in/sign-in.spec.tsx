import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { SignIn } from './sign-in.component';

describe(' SignIn', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<SignIn idp="google" profile={null} onSignIn={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
