import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { Card } from './card';

describe(' Card', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<Card />);
    expect(baseElement).toBeTruthy();
  });
});
