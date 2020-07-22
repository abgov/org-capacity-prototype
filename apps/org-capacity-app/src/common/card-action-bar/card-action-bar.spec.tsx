import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { CardActionBar } from './card-action-bar';

describe(' CardActionBar', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<CardActionBar/>);
    expect(baseElement).toBeTruthy();
  });
});
