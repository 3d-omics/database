import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TableHeader from './index';
import { ColumnDef } from '@tanstack/react-table';

// Mock DownloadTSVButton
vi.mock('./DownloadTSVButton', () => ({
  default: ({ buttonLabel }: { buttonLabel: string }) => (
    <button data-testid="download-tsv-button">{buttonLabel}</button>
  ),
}));

describe('TableHeader', () => {
  const mockData = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  const mockColumns: ColumnDef<typeof mockData[0]>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
  ];

  it('renders page title', () => {
    render(
      <TableHeader
        pageTitle="Animal Trials"
        filteredDataLength={10}
        filteredAndSortedData={mockData}
        columns={mockColumns}
      />
    );

    expect(screen.getByText('Animal Trials')).toBeInTheDocument();
  });

  it('displays filtered data count', () => {
    render(
      <TableHeader
        pageTitle="Test Table"
        filteredDataLength={42}
        filteredAndSortedData={mockData}
        columns={mockColumns}
      />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('records')).toBeInTheDocument();
  });

  it('renders download TSV button', () => {
    render(
      <TableHeader
        pageTitle="Test Table"
        filteredDataLength={10}
        filteredAndSortedData={mockData}
        columns={mockColumns}
      />
    );

    expect(screen.getByTestId('download-tsv-button')).toBeInTheDocument();
    expect(screen.getByText('Download as TSV')).toBeInTheDocument();
  });

  it('shows zero records when no data', () => {
    render(
      <TableHeader
        pageTitle="Empty Table"
        filteredDataLength={0}
        filteredAndSortedData={[]}
        columns={mockColumns}
      />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});