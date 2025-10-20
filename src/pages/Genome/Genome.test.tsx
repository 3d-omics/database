import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Genome from '.'


// Mock react-router useParams
vi.mock('react-router-dom', () => ({
  useParams: () => ({
    genomeName: 'Genome_123',
    experimentName: 'Experiment_A',
  }),
}))

// Mock child components to avoid heavy rendering
vi.mock('./components/Details', () => ({
  default: ({ genomeData }: any) => <div>Details Component - {genomeData.genome}</div>,
}))
vi.mock('./components/SamplesContainingThisGenome', () => ({
  default: ({ genomeName }: any) => <div>Samples Component - {genomeName}</div>,
}))
vi.mock('components/Tabs', () => ({
  default: ({ selectedTab, setSelectedTab, tabs }: any) => (
    <div>
      {tabs.map((tab: string) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          aria-pressed={selectedTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  ),
}))
vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div>ErrorBanner: {children}</div>,
}))
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div>Breadcrumbs: {items.map((i: any) => i.label).join(' > ')}</div>
  ),
}))
vi.mock('pages/NotFound', () => ({
  default: () => <div>NotFound Page</div>,
}))
vi.mock('components/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

// Mock useFetchExcelFileData
const mockFetchExcel = vi.fn()
vi.mock('hooks/useFetchExcelFileData', () => ({
  default: () => ({
    fetchExcel: mockFetchExcel,
    fetchExcelError: null,
  }),
}))



describe('Genome page', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })


  it('renders NotFound if genome is not in metadata', async () => {
    // fetchExcel returns genome data without matching genomeName
    mockFetchExcel.mockResolvedValueOnce({
      genome: ['OtherGenome'],
      phylum: ['p__Firmicutes'],
    })
    render(<Genome />)
    await waitFor(() => {
      expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
    })
  })



  it('renders Details when genome is found', async () => {
    // genomeName is "Genome_123", so return a matching entry
    mockFetchExcel.mockResolvedValueOnce({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })
    render(<Genome />)
    await waitFor(() => {
      expect(
        screen.getByText(/Details Component - Genome_123/i)
      ).toBeInTheDocument()
    })
  })





  it('switches tabs correctly', async () => {
    mockFetchExcel.mockResolvedValueOnce({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })
    render(<Genome />)
    // Details shown by default
    await waitFor(() => {
      expect(screen.getByText(/Details Component/i)).toBeInTheDocument()
    })
    // Switch to "Samples containing this genome"
    fireEvent.click(screen.getByRole('button', { name: /Samples containing this genome/i }))
    expect(
      screen.getByText(/Samples Component - Genome_123/i)
    ).toBeInTheDocument()
  })




  
  it('page does not crash when fetchExcelError exists', async () => {
    vi.doMock('hooks/useFetchExcelFileData', () => ({
      default: () => ({
        fetchExcel: mockFetchExcel.mockResolvedValueOnce({}), // Return an object to avoid NotFound
        fetchExcelError: 'Something went wrong',
      }),
    }))
    render(<Genome />)
    await waitFor(() => {
      expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
    })
  })


})

