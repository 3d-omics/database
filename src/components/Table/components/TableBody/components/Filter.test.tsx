import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Filter from './Filter';

// Mock DebouncedInput
vi.mock('./DebouncedInput', () => ({
  default: ({ onChange, value, placeholder, id }: any) => (
    <input
      data-testid="debounced-input"
      onChange={(e) => onChange(e.target.value)}
      value={value}
      placeholder={placeholder}
      id={id}
    />
  ),
}));

describe('Filter', () => {
  const createMockColumn = (meta?: any) => ({
    id: 'test-column',
    getFilterValue: vi.fn().mockReturnValue(''),
    setFilterValue: vi.fn(),
    columnDef: { meta },
  });

  it('renders select when filterVariant is select', () => {
    const mockColumn = createMockColumn({
      filterVariant: 'select',
      uniqueValues: ['Value1', 'Value2'],
    });

    render(<Filter column={mockColumn as any} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Value1')).toBeInTheDocument();
    expect(screen.getByText('Value2')).toBeInTheDocument();
  });

  it('renders DebouncedInput when filterVariant is not select', () => {
    const mockColumn = createMockColumn({});

    render(<Filter column={mockColumn as any} />);

    expect(screen.getByTestId('debounced-input')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('filters out undefined values from select options', () => {
    const mockColumn = createMockColumn({
      filterVariant: 'select',
      uniqueValues: ['Value1', undefined, 'Value2', undefined],
    });

    render(<Filter column={mockColumn as any} />);

    expect(screen.getByText('Value1')).toBeInTheDocument();
    expect(screen.getByText('Value2')).toBeInTheDocument();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3); // "All" + 2 values
  });

  it('calls setFilterValue when select changes', async () => {
    const user = userEvent.setup();
    const mockColumn = createMockColumn({
      filterVariant: 'select',
      uniqueValues: ['Value1', 'Value2'],
    });

    render(<Filter column={mockColumn as any} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Value1');

    expect(mockColumn.setFilterValue).toHaveBeenCalledWith('Value1');
  });

  it('calls setFilterValue when DebouncedInput changes', async () => {
    const user = userEvent.setup();
    const mockColumn = createMockColumn({});

    render(<Filter column={mockColumn as any} />);

    const input = screen.getByTestId('debounced-input');
    await user.type(input, 'test');

    expect(mockColumn.setFilterValue).toHaveBeenCalled();
  });

  it('displays current filter value in select', () => {
    const mockColumn = createMockColumn({
      filterVariant: 'select',
      uniqueValues: ['Value1', 'Value2'],
    });
    mockColumn.getFilterValue.mockReturnValue('Value1');

    render(<Filter column={mockColumn as any} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Value1');
  });

  it('displays current filter value in DebouncedInput', () => {
    const mockColumn = createMockColumn({});
    mockColumn.getFilterValue.mockReturnValue('search term');

    render(<Filter column={mockColumn as any} />);

    const input = screen.getByTestId('debounced-input') as HTMLInputElement;
    expect(input.value).toBe('search term');
  });
});