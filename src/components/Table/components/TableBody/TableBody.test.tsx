import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TableBody from '.'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'

// Mock FontAwesome icons
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => <span>{icon.iconName}</span>,
}))

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faSort: { iconName: 'sort' },
  faSortUp: { iconName: 'sort-up' },
  faSortDown: { iconName: 'sort-down' },
}))

// Mock child components
vi.mock('./components/Filter/Filter', () => ({
  default: ({ column }: any) => <div data-testid={`filter-${column.id}`}>Filter</div>,
}))

vi.mock('./components/MetaboliteColumn', () => ({
  default: ({ cell, checkedMetaboliteIds, setCheckedMetaboliteIds }: any) => (
    <div data-testid={`metabolite-column-${cell.row.id}`}>
      <input
        type="checkbox"
        data-testid={`metabolite-checkbox-${cell.row.id}`}
        checked={checkedMetaboliteIds.includes(cell.getValue())}
        onChange={(e) => {
          if (e.target.checked) {
            setCheckedMetaboliteIds([...checkedMetaboliteIds, cell.getValue()])
          } else {
            setCheckedMetaboliteIds(
              checkedMetaboliteIds.filter((id: string) => id !== cell.getValue())
            )
          }
        }}
      />
      {cell.getValue()}
    </div>
  ),
}))

// Test wrapper
const TestWrapper = ({
  data,
  displayTableFilters = true
}: {
  data: any[]
  displayTableFilters?: boolean
}) => {
  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('Metabolite', {
      id: 'Metabolite',
      header: 'Metabolite',
      enableSorting: false,
      enableColumnFilter: false,
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const [checkedItems, setCheckedItems] = React.useState<any[]>([])
  const [checkedMetaboliteIds, setCheckedMetaboliteIds] = React.useState<string[]>([])

  return (
    <TableBody
      table={table}
      checkedItems={checkedItems}
      setCheckedItems={setCheckedItems}
      checkedMetaboliteIds={checkedMetaboliteIds}
      setCheckedMetaboliteIds={setCheckedMetaboliteIds}
      displayTableFilters={displayTableFilters}
    />
  )
}

const mockData = [
  { id: '1', name: 'Item 1', Metabolite: 'MET001' },
  { id: '2', name: 'Item 2', Metabolite: 'MET002' },
]

describe('TableBody', () => {
  it('renders table with headers and data', () => {
    render(<TestWrapper data={mockData} />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Metabolite')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('shows sort icons for sortable columns when displayTableFilters is true', () => {
    render(<TestWrapper data={mockData} displayTableFilters={true} />)
    expect(screen.getAllByText('sort')).toHaveLength(2)
  })

  it('hides sort icons when displayTableFilters is false', () => {
    render(<TestWrapper data={mockData} displayTableFilters={false} />)
    expect(screen.queryByText('sort')).not.toBeInTheDocument()
  })

  it('shows filters for filterable columns when displayTableFilters is true', () => {
    render(<TestWrapper data={mockData} displayTableFilters={true} />)
    expect(screen.getByTestId('filter-id')).toBeInTheDocument()
    expect(screen.queryByTestId('filter-name')).not.toBeInTheDocument()
  })

  it('hides filters when displayTableFilters is false', () => {
    render(<TestWrapper data={mockData} displayTableFilters={false} />)
    expect(screen.queryByTestId('filter-id')).not.toBeInTheDocument()
  })

  it('renders MetaboliteColumn for Metabolite cells', () => {
    render(<TestWrapper data={mockData} />)
    expect(screen.getByTestId('metabolite-column-0')).toBeInTheDocument()
    expect(screen.getByTestId('metabolite-column-1')).toBeInTheDocument()
    expect(screen.getByText('MET001')).toBeInTheDocument()
    expect(screen.getByText('MET002')).toBeInTheDocument()
  })

  it('handles metabolite checkbox interactions', () => {
    render(<TestWrapper data={mockData} />)
    const checkbox = screen.getByTestId('metabolite-checkbox-0')
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('renders empty table when no data provided', () => {
    render(<TestWrapper data={[]} />)
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })
})