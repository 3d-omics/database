import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MacrosampleTab from './MacrosampleTab';

// Mock components
vi.mock('components/Table/components/TableBody', () => ({
  default: () => <div data-testid="table-body">Table Body</div>,
}));

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid="error-banner">{children}</div>,
}));

describe('MacrosampleTab', () => {
  const mockData = [
    {
      id: 'S001',
      count: 0.65,
      enaLink: 'https://www.ebi.ac.uk/ena/browser/view/SRR123',
      run_accession: 'SRR123',
    },
    {
      id: 'S002',
      count: 0.48,
      enaLink: 'https://www.ebi.ac.uk/ena/browser/view/SRR456',
      run_accession: 'SRR456',
    },
  ];

  const renderMacrosampleTab = (props: any) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <MacrosampleTab {...props} />
      </BrowserRouter>
    );
  };

  it('shows loading state when isLoading is true', () => {
    renderMacrosampleTab({
      data: [],
      genomeName: 'Genome1',
      isLoading: true,
      error: null,
    });

    expect(screen.getByText((content, element) => {
      return element?.className?.includes('loading-dots') || false;
    })).toBeInTheDocument();
  });

  it('shows error banner when error exists', () => {
    renderMacrosampleTab({
      data: [],
      genomeName: 'Genome1',
      isLoading: false,
      error: 'Failed to load data',
    });

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('shows no results message when data is empty', () => {
    renderMacrosampleTab({
      data: [],
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText(/No macrosamples containing/i)).toBeInTheDocument();
    expect(screen.getByText('Genome1')).toBeInTheDocument();
  });

  it('renders table with data', () => {
    renderMacrosampleTab({
      data: mockData,
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  it('displays count with plural form', () => {
    renderMacrosampleTab({
      data: mockData,
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/macrosamples containing/)).toBeInTheDocument();
  });

  it('displays count with singular form', () => {
    renderMacrosampleTab({
      data: [mockData[0]],
      genomeName: 'Genome1',
      isLoading: false,
      error: null,
    });

    expect(screen.getByText(/macrosample containing/i)).toBeInTheDocument();
  });
});