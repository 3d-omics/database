import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import TableFilters from './index';

// Mock utility functions
vi.mock('./utils/filterUtils', () => ({
  formatIdForDisplay: (id: string) => id.replace(/_/g, ' '),
  deleteFilter: (index: number, filters: any[]) => filters.filter((_, i) => i !== index),
}));

describe('TableFilters', () => {
  const mockTable = {
    setColumnFilters: vi.fn(),
    setSorting: vi.fn(),
  };

  it('returns null when no filters or sorting', () => {
    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={[]}
      />
    );

    expect(screen.queryByText('Filtered by')).not.toBeInTheDocument();
    expect(screen.queryByText('Sorted by')).not.toBeInTheDocument();
  });

  it('displays filtered by section', () => {
    const filteredBy = [
      { id: 'animal_species', value: 'Pig' },
      { id: 'experiment_id', value: 'EXP001' },
    ];

    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={[]}
      />
    );

    expect(screen.getByText('Filtered by')).toBeInTheDocument();
    expect(screen.getByText('Pig')).toBeInTheDocument();
    expect(screen.getByText('EXP001')).toBeInTheDocument();
  });

  it('displays sorted by section', () => {
    const sortedBy = [{ id: 'name', desc: false }];

    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={sortedBy}
      />
    );

    expect(screen.getByText('Sorted by')).toBeInTheDocument();
    expect(screen.getByText('ascending')).toBeInTheDocument();
  });

  it('shows descending for desc sort', () => {
    const sortedBy = [{ id: 'name', desc: true }];

    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={sortedBy}
      />
    );

    expect(screen.getByText('descending')).toBeInTheDocument();
  });

  it('removes filter when X icon clicked', async () => {
    const user = userEvent.setup();
    const filteredBy = [{ id: 'species', value: 'Pig' }];

    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={[]}
      />
    );

    const removeIcon = screen.getByTestId('remove-filter-icon-for-species');
    await user.click(removeIcon);

    expect(mockTable.setColumnFilters).toHaveBeenCalled();
  });

  it('removes sort when X icon clicked', async () => {
    const user = userEvent.setup();
    const sortedBy = [{ id: 'name', desc: false }];

    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={sortedBy}
      />
    );

    const removeIcon = screen.getByTestId('remove-sort-icon-for-name');
    await user.click(removeIcon);

    expect(mockTable.setSorting).toHaveBeenCalledWith([]);
  });

  it('displays multiple filters', () => {
    const filteredBy = [
      { id: 'species', value: 'Pig' },
      { id: 'status', value: 'Active' },
    ];

    render(
      <TableFilters
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={[]}
      />
    );

    expect(screen.getByText('Pig')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});