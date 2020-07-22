import React from 'react';
import { render, cleanup } from '@testing-library/react';

import PageTitle from './page-title';

describe(' PageTitle', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<PageTitle title="Title" description="stuff" />);
    expect(baseElement).toBeTruthy();
  });
});
