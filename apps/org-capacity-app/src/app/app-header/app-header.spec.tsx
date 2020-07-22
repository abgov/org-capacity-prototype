import React from 'react';
import { render, cleanup } from '@testing-library/react';

import AppHeader from './app-header.component';

describe(' AppHeader', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(
      <AppHeader profile={null} onLogin={() => {}} onLogout={() => {}} onOpenProfile={() => {}}></AppHeader>);
    expect(baseElement).toBeTruthy();
  });
});
