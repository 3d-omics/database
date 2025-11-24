import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TableFilters from '.'

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ onClick, title, ...props }: any) => (
    <button 
      onClick={onClick} 
      title={title}
      data-testid={props['data-testid']}
    >
      X
    </button>
  ),
}))

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faXmark: { iconName: 'xmark' },
}))

// Mock utility functions
vi.mock('./utils/filterUtils', () => ({
  formatIdForDisplay: (id: string) => id.replace(/_/g, ' '),
  deleteFilter: (index: number, filters: any[]) => 
    filters.filter((_, i) => i !== index),
}))

describe('TableFilters', () => {
  const mockTable = {
    setColumnFilters: vi.fn(),
    setSorting: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no filters or sorting applied', () => {
    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={[]}
      />
    )

    expect(screen.queryByText('Filtered by')).not.toBeInTheDocument()
    expect(screen.queryByText('Sorted by')).not.toBeInTheDocument()
  })

  it('displays filters when filteredBy has values', () => {
    const filteredBy = [
      { id: 'name', value: 'Test' },
      { id: 'status', value: 'Active' },
    ]

    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={[]}
      />
    )

    expect(screen.getByText('Filtered by')).toBeInTheDocument()
    expect(screen.getByText('name:')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('status:')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('displays sorting when sortedBy has values', () => {
    const sortedBy = [
      { id: 'name', desc: false },
      { id: 'date', desc: true },
    ]

    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={sortedBy}
      />
    )

    expect(screen.getByText('Sorted by')).toBeInTheDocument()
    expect(screen.getByText('name:')).toBeInTheDocument()
    expect(screen.getByText('ascending')).toBeInTheDocument()
    expect(screen.getByText('date:')).toBeInTheDocument()
    expect(screen.getByText('descending')).toBeInTheDocument()
  })

  it('removes filter when X icon is clicked', () => {
    const filteredBy = [
      { id: 'name', value: 'Test' },
    ]

    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={[]}
      />
    )

    const removeButton = screen.getByTestId('remove-filter-icon-for-name')
    fireEvent.click(removeButton)

    expect(mockTable.setColumnFilters).toHaveBeenCalledWith([])
  })

  it('removes sorting when X icon is clicked', () => {
    const sortedBy = [{ id: 'name', desc: false }]

    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={[]}
        sortedBy={sortedBy}
      />
    )

    const removeButton = screen.getByTestId('remove-sort-icon-for-name')
    fireEvent.click(removeButton)

    expect(mockTable.setSorting).toHaveBeenCalledWith([])
  })

  it('displays both filters and sorting together', () => {
    const filteredBy = [{ id: 'name', value: 'Test' }]
    const sortedBy = [{ id: 'date', desc: true }]

    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={sortedBy}
      />
    )

    expect(screen.getByText('Filtered by')).toBeInTheDocument()
    expect(screen.getByText('Sorted by')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('descending')).toBeInTheDocument()
  })

  it('formats filter IDs for display', () => {
    const filteredBy = [{ id: 'user_name', value: 'John' }]

    render(
      <TableFilters 
        table={mockTable as any}
        filteredBy={filteredBy}
        sortedBy={[]}
      />
    )

    expect(screen.getByText('user name:')).toBeInTheDocument()
  })
})