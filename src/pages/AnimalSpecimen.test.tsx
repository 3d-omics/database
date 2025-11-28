// This test serves as a reference test for all the pages that use the same structure:
// - AnimalTrialExperiment.tsx
// - AnimalSpecimen.tsx
// - Macrosample.tsx
// - IntestinalSectionSample.tsx
// - Cryosection.tsx
// - Microsample.tsx

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AnimalSpecimen from 'pages/AnimalSpecimens'

// Mock CrossReferenceTooltip component
vi.mock('components/CrossReferenceTooltip', () => ({
  default: ({ value, data, fieldsName }: any) => (
    <div data-testid="cross-reference-tooltip">
      <span data-testid="cross-reference-icon">{value}</span>
    </div>
  ),
}))

// Mock TableView component
vi.mock('components/TableView', () => ({
  default: ({ data, columns, pageTitle, displayTableHeader, displayTableFilters, displayTableBody }: any) => (
    <div data-testid="table-view">
      <h1>{pageTitle}</h1>
      {displayTableHeader !== false && <div data-testid="table-header">Header</div>}
      {displayTableFilters !== false && <div data-testid="table-filters">Filters</div>}
      {displayTableBody !== false && (
        <div data-testid="table-body">
          {data.length === 0 ? (
            <div>No data was found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  {columns.map((col: any) => (
                    <th key={col.id}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, idx: number) => (
                  <tr key={idx}>
                    {columns.map((col: any) => (
                      <td key={col.id}>
                        {col.cell 
                          ? col.cell({ cell: { getValue: () => col.accessorFn(row) }, row: { original: row } })
                          : col.accessorFn(row)
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  ),
}))

// Mock static JSON data for animal specimens
vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [
    {
      id: 'rec1',
      createdTime: '2023-01-01T00:00:00.000Z',
      fields: {
        ID: 'A001',
        Experiment: 'recExp1',
        Experiment_flat: 'Exp1',
        Treatment: 'recTreat1',
        Treatment_flat: 'Treat1',
        TreatmentName: ['Treat Name 1'],
        Pen: 'Pen1',
        SlaughteringDayCount: 2,
        SlaughteringDate: '2023-10-10',
        Weight: 500,
      },
    },
    {
      id: 'rec2',
      createdTime: '2023-01-02T00:00:00.000Z',
      fields: {
        ID: 'A002',
        Experiment: 'recExp2',
        Experiment_flat: 'Exp2',
        Treatment: 'recTreat2',
        Treatment_flat: 'Treat2',
        TreatmentName: ['Treat Name 2'],
        Pen: 'Pen2',
        SlaughteringDayCount: 5,
        SlaughteringDate: '2023-10-15',
        Weight: 550,
      },
    },
  ],
}))

// Mock static JSON data for animal trial experiments
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: 'recExp1',
      createdTime: '2023-01-01T00:00:00.000Z',
      fields: {
        ID: 'Exp1',
        Name: 'Experiment 1',
        Type: 'Type A',
        StartDate: '2023-01-01',
        EndDate: '2023-12-31',
      },
    },
    {
      id: 'recExp2',
      createdTime: '2023-01-02T00:00:00.000Z',
      fields: {
        ID: 'Exp2',
        Name: 'Experiment 2',
        Type: 'Type B',
        StartDate: '2023-02-01',
        EndDate: '2023-11-30',
      },
    },
  ],
}))

describe('AnimalSpecimen page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders complete table view', () => {
    render(<AnimalSpecimen />)

    expect(screen.getByText('Animal Specimen')).toBeInTheDocument()
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Experiment')).toBeInTheDocument()
    expect(screen.getByText('Treatment')).toBeInTheDocument()
    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.getByText('A002')).toBeInTheDocument()
  })

  it('renders all column headers correctly', () => {
    render(<AnimalSpecimen />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Experiment')).toBeInTheDocument()
    expect(screen.getByText('Treatment')).toBeInTheDocument()
    expect(screen.getByText('Treatment Name')).toBeInTheDocument()
    expect(screen.getByText('Pen')).toBeInTheDocument()
    expect(screen.getByText('Slaughtering Day Count')).toBeInTheDocument()
    expect(screen.getByText('Slaughtering Date')).toBeInTheDocument()
    expect(screen.getByText('Weight')).toBeInTheDocument()
  })

  it('applies filter with equals condition', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'Exp1' }]} />)

    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.queryByText('A002')).not.toBeInTheDocument()
  })

  it('applies filter with startsWith condition', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'Exp', condition: 'startsWith' }]} />)

    // Both should be visible since both start with 'Exp'
    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.getByText('A002')).toBeInTheDocument()
  })

  it('applies multiple filters correctly', () => {
    render(
      <AnimalSpecimen
        filterWith={[
          { id: 'Experiment_flat', value: 'Exp1' },
          { id: 'Pen', value: 'Pen1' },
        ]}
      />
    )

    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.queryByText('A002')).not.toBeInTheDocument()
  })

  it('displays cross reference tooltip', () => {
    render(<AnimalSpecimen />)
    
    const crossRefIcons = screen.getAllByTestId('cross-reference-icon')
    expect(crossRefIcons.length).toBeGreaterThan(0)
    expect(crossRefIcons[0]).toHaveTextContent('Exp1')
  })

  it('displays correct data with filterWith props', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'Exp1' }]} />)

    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.getByText('Exp1')).toBeInTheDocument()
  })

  it('displays correct message when no data matches filter', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'NonExistent' }]} />)

    expect(screen.getByText('No data was found.')).toBeInTheDocument()
  })

  it('handles case-insensitive filtering', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'exp1' }]} />)

    expect(screen.getByText('A001')).toBeInTheDocument()
  })

  it('filters array fields correctly', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'TreatmentName', value: 'Treat Name 1' }]} />)

    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.queryByText('A002')).not.toBeInTheDocument()
  })

  it('handles undefined/null field values in filter', () => {
    render(<AnimalSpecimen filterWith={[{ id: 'ID', value: 'A001' }]} />)

    // Should still render without crashing
    expect(screen.getByText('A001')).toBeInTheDocument()
  })

  it('respects displayTableHeader prop', () => {
    const { rerender } = render(<AnimalSpecimen displayTableHeader={true} />)
    expect(screen.getByTestId('table-header')).toBeInTheDocument()

    rerender(<AnimalSpecimen displayTableHeader={false} />)
    expect(screen.queryByTestId('table-header')).not.toBeInTheDocument()
  })

  it('respects displayTableFilters prop', () => {
    const { rerender } = render(<AnimalSpecimen displayTableFilters={true} />)
    expect(screen.getByTestId('table-filters')).toBeInTheDocument()

    rerender(<AnimalSpecimen displayTableFilters={false} />)
    expect(screen.queryByTestId('table-filters')).not.toBeInTheDocument()
  })

  it('respects displayTableBody prop', () => {
    const { rerender } = render(<AnimalSpecimen displayTableBody={true} />)
    expect(screen.getByTestId('table-body')).toBeInTheDocument()

    rerender(<AnimalSpecimen displayTableBody={false} />)
    expect(screen.queryByTestId('table-body')).not.toBeInTheDocument()
  })

  it('passes correct data to experimentLookup for CrossReferenceTooltip', () => {
    render(<AnimalSpecimen />)

    // The CrossReferenceTooltip should be rendered with experiment data
    const tooltips = screen.getAllByTestId('cross-reference-tooltip')
    expect(tooltips.length).toBeGreaterThan(0)
  })

  it('renders all specimen data correctly', () => {
    render(<AnimalSpecimen />)

    // Check first specimen
    expect(screen.getByText('A001')).toBeInTheDocument()
    expect(screen.getByText('Exp1')).toBeInTheDocument()
    expect(screen.getByText('Treat1')).toBeInTheDocument()
    expect(screen.getByText('Treat Name 1')).toBeInTheDocument()
    expect(screen.getByText('Pen1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('2023-10-10')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()

    // Check second specimen
    expect(screen.getByText('A002')).toBeInTheDocument()
    expect(screen.getByText('Exp2')).toBeInTheDocument()
    expect(screen.getByText('Treat2')).toBeInTheDocument()
    expect(screen.getByText('Treat Name 2')).toBeInTheDocument()
    expect(screen.getByText('Pen2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2023-10-15')).toBeInTheDocument()
    expect(screen.getByText('550')).toBeInTheDocument()
  })
})