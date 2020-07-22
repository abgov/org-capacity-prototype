import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { LoadResourceWrapper } from './load-resource-wrapper';

describe(' LoadResourceContainer', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<LoadResourceWrapper resource={null} isLoading={false} renderContent={null}/>);
    expect(baseElement).toBeTruthy();
  });
});
