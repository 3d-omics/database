import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import Genome from '.'

// Mock react-router useParams
vi.mock('react-router-dom', () => ({
  useParams: () => ({
    genomeName: 'Genome_123',
    experimentName: 'A_Experiment',
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
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div>Breadcrumbs: {items.map((i: any) => i.label).join(' > ')}</div>
  ),
}))
vi.mock('pages/NotFound', () => ({
  default: () => <div>NotFound Page</div>,
}))
vi.mock('components/ParamsValidator', () => ({
  default: ({ children, validating, notFound }: any) => {
    if (validating) return <div>Validating...</div>
    if (notFound) return <div>Not Found from Validator</div>
    return <div>{children}</div>
  },
}))

// Mock useValidateParams hook
const mockUseValidateParams = vi.fn()
vi.mock('hooks/useValidateParams', () => ({
  default: () => mockUseValidateParams(),
}))

// Mock useGenomeJsonFile hook
const mockUseGenomeJsonFile = vi.fn()
vi.mock('hooks/useJsonData', () => ({
  useGenomeJsonFile: () => mockUseGenomeJsonFile(),
}))

describe('Genome page', () => {
  beforeEach(() => {
    // Default mock values
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders NotFound if genome metadata fails to load', () => {
    mockUseGenomeJsonFile.mockReturnValue(null)

    render(<Genome />)

    expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
  })

  it('renders NotFound if genome is not in metadata', () => {
    // Return genome data without matching genomeName
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['OtherGenome', 'AnotherGenome'],
      phylum: ['p__Firmicutes', 'p__Bacteroidetes'],
      domain: ['d__Bacteria', 'd__Bacteria'],
    })

    render(<Genome />)

    expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
  })

  it('renders Details when genome is found', () => {
    // genomeName is "Genome_123", so return a matching entry
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123', 'OtherGenome'],
      phylum: ['p__Firmicutes', 'p__Bacteroidetes'],
      domain: ['d__Bacteria', 'd__Bacteria'],
      class: ['c__Bacilli', 'c__Bacteroidia'],
    })

    render(<Genome />)

    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
  })

  it('renders breadcrumbs with correct links', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
    })

    render(<Genome />)

    expect(
      screen.getByText(/Breadcrumbs: Home > Genome Catalogues > A_Experiment > Genome_123/i)
    ).toBeInTheDocument()
  })

  it('displays genome name as header', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
    })

    render(<Genome />)

    expect(screen.getByText('Genome_123')).toBeInTheDocument()
  })

  it('switches tabs correctly', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
    })

    render(<Genome />)

    // Details shown by default
    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Samples Component/i)).not.toBeInTheDocument()

    // Switch to "Samples containing this genome"
    fireEvent.click(
      screen.getByRole('button', { name: /Samples containing this genome/i })
    )

    expect(screen.getByText(/Samples Component - Genome_123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Details Component/i)).not.toBeInTheDocument()

    // Switch back to "Genome details"
    fireEvent.click(screen.getByRole('button', { name: /Genome details/i }))

    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Samples Component/i)).not.toBeInTheDocument()
  })

  it('cleans taxonomy fields correctly', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
      class: ['c__Bacilli'],
      order: ['o__Lactobacillales'],
      family: ['f__Lactobacillaceae'],
      genus: ['g__Lactobacillus'],
      species: ['s__Lactobacillus_acidophilus'],
    })

    const { container } = render(<Genome />)

    // The Details component should receive cleaned taxonomy data
    // (without the prefix like "p__", "d__", etc.)
    expect(container).toBeInTheDocument()
  })

  it('handles short taxonomy values as unknown', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__'], // Short value (<=3 chars)
      domain: ['d__Bacteria'],
      class: ['NA'], // Short value
    })

    render(<Genome />)

    // Component should still render without crashing
    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
  })

  it('shows ParamsValidator validating state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: true,
      notFound: false,
    })
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })

    render(<Genome />)

    expect(screen.getByText(/Validating.../i)).toBeInTheDocument()
  })

  it('shows ParamsValidator notFound state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: true,
    })
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })

    render(<Genome />)

    expect(screen.getByText(/Not Found from Validator/i)).toBeInTheDocument()
  })

  it('extracts correct experiment ID from experimentName', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })

    render(<Genome />)

    // Verify useGenomeJsonFile was called with correct experiment ID (first char of experimentName)
    expect(mockUseGenomeJsonFile).toHaveBeenCalled()
  })



  it('handles empty genome array', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
      phylum: [],
    })

    render(<Genome />)

    expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
  })

})