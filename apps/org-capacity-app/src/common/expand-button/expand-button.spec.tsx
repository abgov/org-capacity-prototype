import React from 'react';
import { render, cleanup } from '@testing-library/react';

import ExpandButton from './expand-button';

describe(' ExpandButton', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(
      <ExpandButton 
        expanded={false} 
        onClick={() => {}} 
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
