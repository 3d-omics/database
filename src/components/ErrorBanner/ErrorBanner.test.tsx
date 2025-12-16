import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBanner from './index';

describe('ErrorBanner', () => {
  it('renders error message', () => {
    render(<ErrorBanner>Error details</ErrorBanner>);
    expect(screen.getByText('Error! Something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('renders children text', () => {
    render(<ErrorBanner>Custom error details</ErrorBanner>);
    expect(screen.getByText('Custom error details')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<ErrorBanner>{null}</ErrorBanner>);
    expect(screen.getByText('Error! Something went wrong. Please try again.')).toBeInTheDocument();
  });
});