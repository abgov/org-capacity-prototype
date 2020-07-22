import React from 'react';
import { render, cleanup } from '@testing-library/react';

import MetricPane from './metric-pane';

describe(' MetricPane', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(<MetricPane value={0} name="metric" isLoading={false}/>);
    expect(baseElement).toBeTruthy();
  });
});
