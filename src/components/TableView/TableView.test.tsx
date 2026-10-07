import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TableView from './index'
import { ColumnDef } from '@tanstack/react-table'

// Mock child components
vi.mock('components/Table', () => ({
  default: ({ pageTitle, displayTableTitle, displayTableDescription, recordFilterControls }: any) => (
    <div
      data-testid='table'
      data-display-title={String(displayTableTitle)}
      data-display-description={String(displayTableDescription)}
    >
      {pageTitle}
      {recordFilterControls}
    </div>
  ),
}))

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid='error-banner'>{children}</div>,
}))

describe('TableView', () => {
  const mockColumns: ColumnDef<any>[] = [
    { accessorKey: 'id', header: 'ID' },
  ]

  const mockData = [{ id: '1' }, { id: '2' }]

  it('renders Table with data', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle='Test Table'
      />
    )

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByText('Test Table')).toBeInTheDocument()
  })

  it('shows error banner when fetchMetaboliteError exists', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle='Test Table'
        fetchMetaboliteError='Network error'
      />
    )

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText('Error fetching metabolite data, Please try again')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(
      <TableView
        columns={mockColumns}
        data={[]}
        pageTitle='Animal Trials'
      />
    )

    expect(screen.getByText(/No/i)).toBeInTheDocument()
    expect(screen.getByText(/data was found./i)).toBeInTheDocument()
    expect(screen.queryByTestId('table')).not.toBeInTheDocument()
  })

  it('does not show Table when data is empty', () => {
    render(
      <TableView
        columns={mockColumns}
        data={[]}
        pageTitle='Test'
      />
    )

    expect(screen.queryByTestId('table')).not.toBeInTheDocument()
  })

  it('keeps record filters available when their selection has no matches', () => {
    render(
      <TableView
        columns={mockColumns}
        data={[]}
        pageTitle='Macrosamples'
        recordFilterControls={<button type='button'>All</button>}
      />
    )

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  })

  it('does not show error banner when no error', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle='Test'
      />
    )

    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument()
  })

  it('keeps the title on the table when it is not the page', () => {
    render(
      <TableView
        columns={mockColumns}
        data={mockData}
        pageTitle='Test Table'
        tableDescription='About the table'
      />
    )

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.getByTestId('table')).toHaveAttribute('data-display-title', 'true')
  })

  it('opens the page with its title and description on the page header', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TableView
          columns={mockColumns}
          data={mockData}
          pageTitle='Animal Trials'
          tableDescription='About the trials'
          displayPageHeader
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Animal Trials' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveTextContent('Data Portal Home')
    expect(screen.getByRole('banner')).toHaveTextContent('About the trials')
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('searchbox', { name: 'Search the data portal' }))

    const table = screen.getByTestId('table')
    expect(table).toHaveAttribute('data-display-title', 'false')
    expect(table).toHaveAttribute('data-display-description', 'false')
  })
})
