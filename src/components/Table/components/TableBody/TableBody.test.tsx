import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TableBody from './index';

// Mock Filter component
vi.mock('./components/Filter', () => ({
  default: () => <div data-testid="filter-component">Filter</div>,
}));

describe('TableBody', () => {
  const mockTable = {
    getHeaderGroups: () => [
      {
        id: 'header-group-1',
        headers: [
          {
            id: 'name',
            isPlaceholder: false,
            column: {
              getCanSort: () => true,
              getCanFilter: () => true,
              getToggleSortingHandler: () => vi.fn(),
              getNextSortingOrder: () => 'asc',
              getIsSorted: () => false,
              columnDef: { header: 'Name' },
            },
            getContext: () => ({}),
          },
          {
            id: 'status',
            isPlaceholder: false,
            column: {
              getCanSort: () => false,
              getCanFilter: () => false,
              getToggleSortingHandler: () => vi.fn(),
              getNextSortingOrder: () => null,
              getIsSorted: () => false,
              columnDef: { header: 'Status' },
            },
            getContext: () => ({}),
          },
        ],
      },
    ],
    getRowModel: () => ({
      rows: [
        {
          id: 'row-1',
          getVisibleCells: () => [
            {
              id: 'cell-1',
              column: { columnDef: { cell: 'Item 1' } },
              getContext: () => ({}),
            },
            {
              id: 'cell-2',
              column: { columnDef: { cell: 'Active' } },
              getContext: () => ({}),
            },
          ],
        },
      ],
    }),
  };

  it('renders table structure', () => {
    render(<TableBody table={mockTable as any} />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders headers', () => {
    render(<TableBody table={mockTable as any} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders rows', () => {
    render(<TableBody table={mockTable as any} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows sort icon for sortable columns', () => {
    render(<TableBody table={mockTable as any} />);
    expect(screen.getByTestId('sort-icon-for-name')).toBeInTheDocument();
  });

  it('shows filter component when column can be filtered', () => {
    render(<TableBody table={mockTable as any} />);
    expect(screen.getByTestId('filter-component')).toBeInTheDocument();
  });

  it('hides sort and filter when displayTableFilters is false', () => {
    render(<TableBody table={mockTable as any} displayTableFilters={false} />);
    expect(screen.queryByTestId('sort-icon-for-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('filter-component')).not.toBeInTheDocument();
  });

  it('renders empty table when no rows', () => {
    const emptyTable = {
      ...mockTable,
      getRowModel: () => ({ rows: [] }),
    };

    render(<TableBody table={emptyTable as any} />);
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });
});