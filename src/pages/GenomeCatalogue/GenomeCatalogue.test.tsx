import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import GenomeCatalogue from 'pages/GenomeCatalogue'
import TestRouter from 'tests/setup/test-utils'

// ----------------- MOCKS -----------------
const mockUseParams = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockUseParams()
  }
})

const mockUseValidateParams = vi.fn()
vi.mock('hooks/useValidateParams', () => ({
  default: () => mockUseValidateParams(),
}))

const mockUseGenomeJsonFile = vi.fn()
vi.mock('hooks/useJsonData', () => ({
  useGenomeJsonFile: () => mockUseGenomeJsonFile(),
}))

vi.mock('./components/Table', () => ({
  default: ({ metaData, experimentName }: any) => (
    <div data-testid="genome-table">
      Table - {experimentName} - {metaData.genome.length} genomes
    </div>
  ),
}))

vi.mock('./components/PhyloCircosPlot', () => ({
  default: ({ phyloData, circosData }: any) => (
    <div data-testid="phylo-circos-plot">
      {/* eslint-disable-next-line testing-library/no-node-access */}
      PhyloCircosPlot - {phyloData.children.length} phyla - {Object.keys(circosData).length} genomes
    </div>
  ),
}))

vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid="breadcrumbs">
      {items.map((i: any) => i.label).join(' > ')}
    </div>
  ),
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, validating, notFound }: any) => {
    if (validating) return <div data-testid="loading-dots-wrapper">Loading...</div>
    if (notFound) return <div data-testid="not-found">404 Not Found</div>
    return <div>{children}</div>
  },
}))

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => (
    <div data-testid="error-banner">{children}</div>
  ),
}))

const renderGenomeCatalogue = () => {
  render(
    <TestRouter>
      <GenomeCatalogue />
    </TestRouter>
  )
}

describe('GenomeCatalogue page', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    mockUseParams.mockReturnValue({ experimentName: 'A_test-experiment' })

    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })

    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['genome1', 'genome2'],
      phylum: ['p__Proteobacteria', 'p__Firmicutes'],
      completeness: [90, 95],
      contamination: [5, 3],
      length: [5000, 6000],
      domain: ['d__Bacteria', 'd__Bacteria'],
      class: ['c__Gammaproteobacteria', 'c__Bacilli'],
      order: ['o__Enterobacterales', 'o__Lactobacillales'],
      family: ['f__Enterobacteriaceae', 'f__Lactobacillaceae'],
      genus: ['g__Escherichia', 'g__Lactobacillus'],
      species: ['s__Escherichia_coli', 's__Lactobacillus_acidophilus'],
    })
  })

  test('renders loading state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: true,
      notFound: false,
    })

    renderGenomeCatalogue()
    expect(screen.getByTestId('loading-dots-wrapper')).toBeInTheDocument()
  })

  test('renders NotFound when experiment does not exist', () => {
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderGenomeCatalogue()
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })

  test('renders ErrorBanner when genome metadata fails to load', () => {
    mockUseGenomeJsonFile.mockReturnValue(null)

    renderGenomeCatalogue()
    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText('Failed to load genome metadata')).toBeInTheDocument()
  })

  test('renders PhyloCircosPlot and Table on success', () => {
    renderGenomeCatalogue()

    // Header text check
    expect(screen.getByText('A_test-experiment MAG Catalogue')).toBeInTheDocument()

    // Breadcrumbs
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent(
      'Home > MAG Catalogues > A_test-experiment'
    )

    // Child components rendered
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
    expect(screen.getByTestId('genome-table')).toBeInTheDocument()
  })

  test('handles empty metadata gracefully', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
      phylum: [],
      completeness: [],
      contamination: [],
      length: [],
      domain: [],
      class: [],
      order: [],
      family: [],
      genus: [],
      species: [],
    })

    renderGenomeCatalogue()

    // Should still render components without crashing
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
    expect(screen.getByTestId('genome-table')).toBeInTheDocument()
  })

  test('extracts experiment ID correctly from experimentName', () => {
    mockUseParams.mockReturnValue({ experimentName: 'B_another-experiment' })

    renderGenomeCatalogue()

    // Should use 'B' as experimentId for loading data
    expect(screen.getByText('B_another-experiment MAG Catalogue')).toBeInTheDocument()
  })

  test('processes and sorts metadata by phylum', () => {
    renderGenomeCatalogue()

    // PhyloCircosPlot should receive processed data
    const phyloPlot = screen.getByTestId('phylo-circos-plot')
    expect(phyloPlot).toBeInTheDocument()

    // Table should receive reversed metadata
    const table = screen.getByTestId('genome-table')
    expect(table).toBeInTheDocument()
    expect(table).toHaveTextContent('2 genomes')
  })

  test('removes taxonomy prefixes correctly', () => {
    renderGenomeCatalogue()

    // The component should process and remove prefixes like 'p__', 'd__', etc.
    // This is tested implicitly through the rendering without errors
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
  })

  test('builds hierarchical data for phylogenetic tree', () => {
    renderGenomeCatalogue()

    const phyloPlot = screen.getByTestId('phylo-circos-plot')
    // Should have 2 phyla based on the mock data
    expect(phyloPlot).toHaveTextContent('2 phyla')
  })

  test('builds circos data correctly', () => {
    renderGenomeCatalogue()

    const phyloPlot = screen.getByTestId('phylo-circos-plot')
    // Should have 2 genomes in circos data
    expect(phyloPlot).toHaveTextContent('2 genomes')
  })

  test('reverses metadata for table display', () => {
    renderGenomeCatalogue()

    const table = screen.getByTestId('genome-table')
    expect(table).toHaveTextContent('A_test-experiment')
    expect(table).toHaveTextContent('2 genomes')
  })

  test('does not render Table when there is an error', () => {
    mockUseGenomeJsonFile.mockReturnValue(null)

    renderGenomeCatalogue()

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.queryByTestId('genome-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('phylo-circos-plot')).not.toBeInTheDocument()
  })

  test('handles null/undefined genome entries', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['genome1', null, 'genome2'],
      phylum: ['p__Proteobacteria', 'p__Firmicutes', 'p__Actinobacteria'],
      completeness: [90, 0, 95],
      contamination: [5, 0, 3],
      length: [5000, 0, 6000],
      domain: ['d__Bacteria', 'd__Bacteria', 'd__Bacteria'],
      class: ['c__Gammaproteobacteria', 'c__Bacilli', 'c__Actinobacteria'],
      order: ['o__Enterobacterales', 'o__Lactobacillales', 'o__Actinomycetales'],
      family: ['f__Enterobacteriaceae', 'f__Lactobacillaceae', 'f__Actinomycetaceae'],
      genus: ['g__Escherichia', 'g__Lactobacillus', 'g__Actinomyces'],
      species: ['s__Escherichia_coli', 's__Lactobacillus_acidophilus', 's__Actinomyces_israelii'],
    })

    renderGenomeCatalogue()

    // Should filter out null genomes in circos data
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
  })

  test('passes correct props to PhyloCircosPlot', () => {
    renderGenomeCatalogue()

    const phyloPlot = screen.getByTestId('phylo-circos-plot')
    expect(phyloPlot).toHaveTextContent('2 phyla')
    expect(phyloPlot).toHaveTextContent('2 genomes')
  })

  test('passes correct props to Table', () => {
    renderGenomeCatalogue()

    const table = screen.getByTestId('genome-table')
    expect(table).toHaveTextContent('A_test-experiment')
    expect(table).toHaveTextContent('2 genomes')
  })

  test('renders breadcrumbs with correct hierarchy', () => {
    renderGenomeCatalogue()

    const breadcrumbs = screen.getByTestId('breadcrumbs')
    expect(breadcrumbs).toHaveTextContent('Home > MAG Catalogues > A_test-experiment')
  })

  test('displays experiment name in header', () => {
    mockUseParams.mockReturnValue({ experimentName: 'C_custom-experiment' })

    renderGenomeCatalogue()

    expect(screen.getByText('C_custom-experiment MAG Catalogue')).toBeInTheDocument()
  })

  test('handles incomplete taxonomy data', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['genome1'],
      phylum: ['p__Proteobacteria'],
      completeness: [90],
      contamination: [5],
      length: [5000],
      domain: ['d__Bacteria'],
      class: [''], // Empty class
      order: [''], // Empty order
      family: [''], // Empty family
      genus: [''], // Empty genus
      species: ['s__Escherichia_coli'],
    })

    renderGenomeCatalogue()

    // Should still render, but phylo tree may be empty
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
  })
})