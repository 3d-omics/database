import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MicrosampleTab from './MicrosampleTab';

// Mock components
vi.mock('components/Table/components/TableBody', () => ({
  default: () => <div data-testid="table-body">Table Body</div>,
}));

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid="error-banner">{children}</div>,
}));

describe('MicrosampleTab', () => {
  const mockData = [
    {
      id: 'M001',
      count: 0.45,
      enaLink: 'https://www.ebi.ac.uk/ena/browser/view/ERR123',
      run_accession: 'ERR123',
    },
    {
      id: 'M002',
      count: 0.32,
      enaLink: 'https://www.ebi.ac.uk/ena/browser/view/ERR456',
      run_accession: 'ERR456',
    },
  ];

  const renderMicrosampleTab = (props: any) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <MicrosampleTab {...props} />
      </BrowserRouter>
    );
  };

  it('shows loading state when isLoading is true', () => {
    renderMicrosampleTab({
      data: null,
      genomeName: 'Genome1',
      isLoading: true,
      error: null,
    });

    expect(screen.getByText((content, element) => {
      return element?.className?.includes('loading-dots') || false;
    })).toBeInTheDocument();
  });

  it('shows error banner when error exists', () => {
    renderMicrosampleTab({
      data: null,
      genomeName: 'Genome1',
      isLoading: false,
      error: 'Failed to load data',
    });

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('shows no results message when data is null', () => {
    renderMicrosampleTab({
      data: null,
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText(/No microsamples containing/i)).toBeInTheDocument();
    expect(screen.getByText('Genome1')).toBeInTheDocument();
  });

  it('shows no results message when data is empty', () => {
    renderMicrosampleTab({
      data: [],
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText(/No microsamples containing/i)).toBeInTheDocument();
  });

  it('renders table with data', () => {
    renderMicrosampleTab({
      data: mockData,
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  it('displays count with plural form', () => {
    renderMicrosampleTab({
      data: mockData,
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/microsamples containing/)).toBeInTheDocument();
  });

  it('displays count with singular form', () => {
    renderMicrosampleTab({
      data: [mockData[0]],
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('microsample containing')).toBeInTheDocument();
    expect(screen.getByText('Genome1')).toBeInTheDocument();
  });

})