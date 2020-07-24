import React from 'react';
import { render, cleanup } from '@testing-library/react';

import AppHeader from './app-header.component';

describe(' AppHeader', () => {
  afterEach(cleanup);

  it('should render successfully', () => {
    const { baseElement } = render(
      <AppHeader 
        profile={null} 
        onLogin={() => {
          // do nothing.
        }} 
        onLogout={() => {
          // do nothing.
        }} 
        onOpenProfile={() => {
          // do nothing.
        }} 
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
