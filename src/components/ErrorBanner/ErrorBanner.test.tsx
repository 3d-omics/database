import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ErrorBanner from '.';

describe('ErrorBanner', () => {
  it('components > renders error message with children string', () => {
    render(<ErrorBanner>Request failed with status code 404</ErrorBanner>);
    expect(screen.getByText('Error! Something went wrong. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Request failed with status code 404')).toBeInTheDocument();
  });
});