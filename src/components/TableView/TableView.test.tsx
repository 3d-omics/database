import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TableView from './index';
import { ColumnDef } from '@tanstack/react-table';

// Mock child components
vi.mock('components/Table', () => ({
  default: ({ pageTitle }: any) => <div data-testid="table">{pageTitle}</div>,
}));

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid="error-banner">{children}</div>,
}));

describe('TableView', () => {
  const mockColumns: ColumnDef<any>[] = [
    { accessorKey: 'id', header: 'ID' },
  ];

  const mockData = [{ id: '1' }, { id: '2' }];

  it('renders Table with data', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle="Test Table"
      />
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  it('shows error banner when fetchMetaboliteError exists', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle="Test Table"
        fetchMetaboliteError="Network error"
      />
    );

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText('Error fetching metabolite data, Please try again')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <TableView
        columns={mockColumns}
        data={[]}
        pageTitle="Animal Trials"
      />
    );

    expect(screen.getByText(/No/i)).toBeInTheDocument();
    expect(screen.getByText(/data was found./i)).toBeInTheDocument();
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
  });

  it('does not show Table when data is empty', () => {
    render(
      <TableView
        columns={mockColumns}
        data={[]}
        pageTitle="Test"
      />
    );

    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
  });

  it('does not show error banner when no error', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle="Test"
      />
    );

    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument();
  });
});