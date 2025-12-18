import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AnimalSpecimens from './AnimalSpecimens'

// Mock data
vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'AS001',
        Experiment: 'EXP001',
        Experiment_flat: 'Experiment G',
        Treatment: 'T1',
        Treatment_flat: 'Treatment 1',
        TreatmentName: ['Control'],
        Pen: 'P1',
        SlaughteringDayCount: 35,
        SlaughteringDate: '2024-02-05',
        Weight: 2.5,
        'Biosample accession': 'SAMN12345',
        'Biosample link': 'https://example.com/biosample',
      },
    },
    {
      id: '2',
      createdTime: '2024-01-02',
      fields: {
        ID: 'AS002',
        Experiment: 'EXP001',
        Experiment_flat: 'Experiment G',
        Treatment: 'T2',
        Treatment_flat: 'Treatment 2',
        TreatmentName: ['Test'],
        Pen: 'P2',
        SlaughteringDayCount: 42,
        SlaughteringDate: '2024-02-12',
        Weight: 3.0,
      },
    },
  ],
}))

vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        ID: 'EXP001',
        Name: 'Experiment G',
        Type: 'Poultry',
      },
    },
  ],
}))

// Mock TableView
vi.mock('components/TableView', () => ({
  default: ({ data, columns, pageTitle, tableDescription }: any) => (
    <div data-testid='table-view'>
      <div data-testid='page-title'>{pageTitle}</div>
      <div data-testid='table-description'>{tableDescription}</div>
      <div data-testid='data-count'>{data.length}</div>
      <div data-testid='column-count'>{columns.length}</div>
    </div>
  ),
}))

// Mock CrossReferenceTooltip
vi.mock('components/CrossReferenceTooltip', () => ({
  default: ({ value }: any) => <span>{value}</span>,
}))

describe('AnimalSpecimens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AnimalSpecimens {...props} />
      </BrowserRouter>
    )
  }

  it('renders TableView component', () => {
    renderComponent()
    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })

  it('passes correct page title', () => {
    renderComponent()
    expect(screen.getByTestId('page-title')).toHaveTextContent('Animal Specimens')
  })

  it('passes table description', () => {
    renderComponent()
    expect(screen.getByTestId('table-description')).toHaveTextContent(/experimental units/i)
  })

  it('displays all data by default', () => {
    renderComponent()
    expect(screen.getByTestId('data-count')).toHaveTextContent('2')
  })

  it('creates correct number of columns', () => {
    renderComponent()
    expect(screen.getByTestId('column-count')).toHaveTextContent('9')
  })

  it('filters data with startsWith condition', () => {
    renderComponent({
      filterWith: [{ id: 'ID', value: 'AS00', condition: 'startsWith' }],
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('2')
  })

  it('filters data with equals condition', () => {
    renderComponent({
      filterWith: [{ id: 'Pen', value: 'P1', condition: 'equals' }],
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('1')
  })

  it('handles multiple filters', () => {
    renderComponent({
      filterWith: [
        { id: 'Experiment_flat', value: 'Experiment G', condition: 'equals' },
        { id: 'Pen', value: 'P1', condition: 'equals' },
      ],
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('1')
  })

  it('handles empty filter array', () => {
    renderComponent({ filterWith: [] })
    expect(screen.getByTestId('data-count')).toHaveTextContent('2')
  })

  it('filters out null/undefined values', () => {
    renderComponent({
      filterWith: [{ id: 'Biosample accession', value: 'SAMN', condition: 'startsWith' }],
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('1')
  })

  it('passes display props to TableView', () => {
    renderComponent({
      displayTableHeader: true,
      displayTableFilters: true,
      displayTableBody: false,
    })

    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })
})