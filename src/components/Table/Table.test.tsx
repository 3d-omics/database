import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Table from './index'
import { ColumnDef } from '@tanstack/react-table'

// Mock child components
vi.mock('./components/Pagination', () => ({
  default: () => <div data-testid='pagination'>Pagination</div>,
}))

vi.mock('./components/TableHeader', () => ({
  default: ({ filteredDataLength }: any) => <div data-testid='table-header'>{filteredDataLength} records</div>,
}))

vi.mock('./components/TableFilters', () => ({
  default: () => <div data-testid='table-filters'>Table Filters</div>,
}))

vi.mock('./components/TableBody', () => ({
  default: ({ table }: any) => <div data-testid='table-body'>{table.getRowModel().rows.map((row: any) => row.original.id).join(',')}</div>,
}))

describe('Table', () => {
  const mockData = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ]

  const mockColumns: ColumnDef<typeof mockData[0]>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
  ]

  it('renders all sections by default', () => {
    render(<Table data={mockData} columns={mockColumns} pageTitle='Test Table' />)

    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-filters')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('applies both initial column filters to the visible rows', () => {
    const data = [
      { id: '1', trial: 'G', treatment: 'TG1' },
      { id: '2', trial: 'G', treatment: 'TG2' },
      { id: '3', trial: 'F', treatment: 'TF1' },
    ]
    const columns: ColumnDef<typeof data[0]>[] = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'trial', header: 'Trial', filterFn: 'equalsString' },
      { accessorKey: 'treatment', header: 'Treatment', filterFn: 'equalsString' },
    ]

    render(<Table
      data={data}
      columns={columns}
      pageTitle='Animal Specimens'
      initialColumnFilters={[{ id: 'trial', value: 'G' }, { id: 'treatment', value: 'TG1' }]}
    />)

    expect(screen.getByTestId('table-header')).toHaveTextContent('1 records')
    expect(screen.getByTestId('table-body')).toHaveTextContent('1')
    expect(screen.getByTestId('table-body')).not.toHaveTextContent('2')
    expect(screen.getByTestId('table-body')).not.toHaveTextContent('3')
  })

  it('hides TableHeader when displayTableHeader is false', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        pageTitle='Test Table'
        displayTableHeader={false}
      />
    )

    expect(screen.queryByTestId('table-header')).not.toBeInTheDocument()
  })

  it('hides TableFilters when displayTableFilters is false', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        pageTitle='Test Table'
        displayTableFilters={false}
      />
    )

    expect(screen.queryByTestId('table-filters')).not.toBeInTheDocument()
  })

  it('hides TableBody when displayTableBody is false', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        pageTitle='Test Table'
        displayTableBody={false}
      />
    )

    expect(screen.queryByTestId('table-body')).not.toBeInTheDocument()
  })

  it('renders table description when provided', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        pageTitle='Test Table'
        tableDescription='This is a test description'
      />
    )

    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('hides table description when displayTableDescription is false', () => {
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        pageTitle='Test Table'
        displayTableDescription={false}
        tableDescription='This should not appear'
      />
    )

    expect(screen.queryByText('This should not appear')).not.toBeInTheDocument()
  })

  it('shows "No results" message when data is empty', () => {
    render(<Table data={[]} columns={mockColumns} pageTitle='Test Table' />)

    expect(screen.getByText('No results match for this search criteria')).toBeInTheDocument()
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })
})
