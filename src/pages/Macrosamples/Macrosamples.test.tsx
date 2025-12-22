import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Macrosamples from './index'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'

// Mock hooks
vi.mock('hooks/useMetaboliteExcelFileData')

// Mock utilities
vi.mock('pages/Macrosamples/utils/mergeMetaboliteData', () => ({
  mergeExcelWithAirtableData: vi.fn((sampleData, airtableData) => airtableData),
}))

// Mock config
vi.mock('config/metaboliteOptions', () => ({
  getExperimentOptions: vi.fn(() => ({
    Treatment: {
      T1: 'Treatment 1',
      T2: 'Treatment 2',
    },
  })),
}))

// Mock data
vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'M001',
        Experiment_code: 'G',
        ExperimentalUnit_Series: 'Series1',
        Individual: 'AS001',
        Code: 'CODE123',
        'Sample type': 'Tissue',
        'Data type': 'Metagenomics',
        Description: 'Ileum sample',
        Container: 'Tube',
        Preservative: 'Ethanol',
        'ENA accession': 'ERS12345',
        'ENA link': 'https://example.com/ena',
      },
    },
    {
      id: '2',
      createdTime: '2024-01-02',
      fields: {
        ID: 'M002',
        Experiment_code: 'G',
        ExperimentalUnit_Series: 'Series1',
        Individual: 'AS002',
        Code: 'CODE456',
        'Sample type': 'Digesta',
        'Data type': 'Metabolomics',
        Description: 'Cecum sample',
        Container: 'Tube',
        Preservative: 'Frozen',
        'Metabolights accession': 'MTBLS12345',
        'Metabolights link': 'https://example.com/metabolights',
      },
    },
  ],
}))

vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        ID: 'AS001',
        Treatment_flat: 'Treatment 1',
      },
    },
  ],
}))

// Mock components
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

vi.mock('components/CrossReferenceTooltip', () => ({
  default: ({ value }: any) => <span>{value}</span>,
}))

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid='error-banner'>{children}</div>,
}))

vi.mock('components/Loading', () => ({
  default: () => <div data-testid='loading'>Loading...</div>,
}))


describe('Macrosamples', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock return for the hook
    (useMetaboliteExcelFileData as any).mockReturnValue({
      sampleMetaDataSheet: null,
      fetchMetaboliteError: null,
    })
  })

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Macrosamples {...props} />
      </BrowserRouter>
    )
  }

  it('renders TableView component', () => {
    renderComponent()
    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })

  it('passes correct default page title', () => {
    renderComponent()
    expect(screen.getByTestId('page-title')).toHaveTextContent('Macrosamples')
  })

  it('passes custom page title', () => {
    renderComponent({ pageTitle: 'Custom Title' })
    expect(screen.getByTestId('page-title')).toHaveTextContent('Custom Title')
  })

  it('passes default table description', () => {
    renderComponent()
    expect(screen.getByTestId('table-description')).toHaveTextContent(/two main types of samples/i)
  })

  it('passes custom table description', () => {
    renderComponent({ tableDescription: 'Custom description' })
    expect(screen.getByTestId('table-description')).toHaveTextContent('Custom description')
  })

  it('displays all data by default', () => {
    renderComponent()
    expect(screen.getByTestId('data-count')).toHaveTextContent('2')
  })

  it('creates default columns when no metabolite data', () => {
    renderComponent()
    // Without metabolite data: ID, Individual, Code, Sample type, Data type, Description, Container, Preservative, ENA, Metabolites = 10
    expect(screen.getByTestId('column-count')).toHaveTextContent('10')
  })

  it('creates checkbox column when metabolite data provided', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      sampleMetaDataSheet: {},
      fetchMetaboliteError: null,
    })

    renderComponent({
      macrosampleWithMetaboliteData: ['M001', 'M002'],
      checkedMetaboliteIds: [],
      setCheckedMetaboliteIds: vi.fn(),
      experimentId: 'G',
    })

    // With metabolite data: Metabolite (checkbox), ID, Individual, Description, Metabolights = 4
    expect(screen.getByTestId('column-count')).toHaveTextContent('5')
  })

  it('filters data by macrosampleWithMetaboliteData', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      sampleMetaDataSheet: {},
      fetchMetaboliteError: null,
    })

    renderComponent({
      macrosampleWithMetaboliteData: ['M001'],
      experimentId: 'G',
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('1')
  })

  it('filters data with startsWith condition', () => {
    renderComponent({
      filterWith: [{ id: 'ID', value: 'M00', condition: 'startsWith' }],
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('2')
  })

  it('filters data with equals condition', () => {
    renderComponent({
      filterWith: [{ id: 'Sample type', value: 'Tissue', condition: 'equals' }],
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('1')
  })

  it('applies both metabolite and filterWith filters', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      sampleMetaDataSheet: {},
      fetchMetaboliteError: null,
    })

    renderComponent({
      macrosampleWithMetaboliteData: ['M001', 'M002'],
      filterWith: [{ id: 'Sample type', value: 'Tissue', condition: 'equals' }],
      experimentId: 'G',
    })

    expect(screen.getByTestId('data-count')).toHaveTextContent('1')
  })

  it('handles empty filter array', () => {
    renderComponent({ filterWith: [] })
    expect(screen.getByTestId('data-count')).toHaveTextContent('2')
  })

  it('uses custom columns when provided', () => {
    const customColumns = [
      { id: 'test', header: 'Test', accessorFn: () => 'test' },
    ]

    renderComponent({ customColumns })
    expect(screen.getByTestId('column-count')).toHaveTextContent('1')
  })

  it('passes display props to TableView', () => {
    renderComponent({
      displayTableHeader: true,
      displayTableDescription: true,
      displayTableFilters: true,
      displayTableBody: false,
    })

    expect(screen.getByTestId('table-view')).toBeInTheDocument()
  })

  it('shows error banner when metabolite fetch fails', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      sampleMetaDataSheet: null,
      fetchMetaboliteError: 'Failed to load metabolite data',
    })

    renderComponent({
      macrosampleWithMetaboliteData: ['M001'],
      experimentId: 'G',
    })

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText('Failed to load metabolite data')).toBeInTheDocument()
  })

  it('shows loading state while waiting for metabolite data', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      sampleMetaDataSheet: null,
      fetchMetaboliteError: null,
    })

    renderComponent({
      macrosampleWithMetaboliteData: ['M001'],
      experimentId: 'G',
    })

    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('skips metabolite data fetch when not needed', () => {
    renderComponent()

    expect(useMetaboliteExcelFileData).toHaveBeenCalledWith({
      experimentId: '',
      skip: true,
    })
  })

  it('fetches metabolite data when needed', () => {
    renderComponent({
      macrosampleWithMetaboliteData: ['M001'],
      experimentId: 'G',
    })

    expect(useMetaboliteExcelFileData).toHaveBeenCalledWith({
      experimentId: 'G',
      skip: false,
    })
  })
})