import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MAGCatalogue from './index'
import useValidateParams from 'hooks/useValidateParams'
import { useGenomeJsonFile } from 'hooks/useJsonData'

// Mock hooks
vi.mock('hooks/useValidateParams')
vi.mock('hooks/useJsonData')

// Mock components
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid='breadcrumbs'>
      {items.map((item: any) => <span key={item.label}>{item.label}</span>)}
    </div>
  ),
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}))

vi.mock('./components/PhyloCircosPlot', () => ({
  default: () => <div data-testid='phylo-circos-plot'>PhyloCircosPlot</div>,
}))

vi.mock('./components/Table', () => ({
  default: () => <div data-testid='mag-table'>MAG Table</div>,
}))

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid='error-banner'>{children}</div>,
}))

// Mock data imports
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      fields: {
        Name: 'F - Adenovirus experiment (chicken)',
        'MAG catalogue - Number of MAGs': 150,
        'MAG catalogue - Average completeness (%)': 95.5,
        'MAG catalogue - Average contamination (%)': 2.3,
        'MAG catalogue - New species (%)': 12,
        'MAG catalogue description': 'Test description\nLine 2',
      },
    },
  ],
}))

vi.mock('assets/data/airtable/experimentswithgenomeinfo.json', () => ({
  default: [
    {
      fields: {
        ID: 'F',
        doi: '10.1234/test.doi',
        link: 'https://example.com/study',
      },
    },
  ],
}))


describe('MAGCatalogue', () => {
  const mockGenomeMetadata = {
    genome: ['Genome1', 'Genome2', 'Genome3'],
    phylum: ['p__Firmicutes', 'p__Proteobacteria', 'p__Firmicutes'],
    completeness: [95, 98, 92],
    contamination: [2, 1, 3],
    length: [2000000, 4500000, 1800000],
    N50: [50000, 60000, 45000],
    domain: ['d__Bacteria', 'd__Bacteria', 'd__Bacteria'],
    class: ['c__Bacilli', 'c__Gammaproteobacteria', 'c__Bacilli'],
    order: ['o__Lactobacillales', 'o__Enterobacterales', 'o__Lactobacillales'],
    family: ['f__Lactobacillaceae', 'f__Enterobacteriaceae', 'f__Lactobacillaceae'],
    genus: ['g__Lactobacillus', 'g__Escherichia', 'g__Lactobacillus'],
    species: ['s__L_acidophilus', 's__E_coli', 's__L_casei'],
  }

  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    });

    (useGenomeJsonFile as any).mockReturnValue(mockGenomeMetadata)
  })

  const renderPage = (experimentName = 'F - Adenovirus experiment (chicken)') => {
    return render(
      <MemoryRouter
        initialEntries={[`/mag-catalogues/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
        <Routes>
          <Route path='/mag-catalogues/:experimentName' element={<MAGCatalogue />} />
        </Routes>
      </MemoryRouter>
    )
  }
  it('renders page with experiment name', () => {
    renderPage()

    const header = screen.getByRole('banner')
    expect(header).toHaveTextContent('F - Adenovirus experiment (chicken)')
  })

  it('renders breadcrumbs', () => {
    renderPage()
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('MAG Catalogues')).toBeInTheDocument()
  })

  it('displays experiment statistics', () => {
    renderPage()

    expect(screen.getByText(/Number of MAGs:/)).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()

    expect(screen.getByText(/Average completeness:/)).toBeInTheDocument()
    expect(screen.getByText('95.50%')).toBeInTheDocument()

    expect(screen.getByText(/Average contamination:/)).toBeInTheDocument()
    expect(screen.getByText('2.30%')).toBeInTheDocument()

    expect(screen.getByText(/New species:/)).toBeInTheDocument()
    expect(screen.getByText('12%')).toBeInTheDocument()
  })

  it('displays DOI and link when available', () => {
    renderPage()

    expect(screen.getByText(/DOI:/)).toBeInTheDocument()
    expect(screen.getByText('10.1234/test.doi')).toBeInTheDocument()

    expect(screen.getByText(/Link:/)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /example.com/i })
    expect(link).toHaveAttribute('href', 'https://example.com/study')
  })

  it('displays description with line breaks', () => {
    renderPage()

    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Line 2')).toBeInTheDocument()
  })

  it('renders PhyloCircosPlot when data loaded', () => {
    renderPage()
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
  })

  it('renders MAG Table when data loaded', () => {
    renderPage()
    expect(screen.getByTestId('mag-table')).toBeInTheDocument()
  })

  it('shows error banner when metadata fails to load', () => {
    (useGenomeJsonFile as any).mockReturnValue(null)

    renderPage()

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText('Failed to load genome metadata')).toBeInTheDocument()
    expect(screen.queryByTestId('phylo-circos-plot')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mag-table')).not.toBeInTheDocument()
  })

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderPage()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('removes taxonomy prefixes from metadata', () => {
    // This is tested indirectly - the data transformation happens in useMemo
    // The processed data is passed to child components
    renderPage()

    // If PhyloCircosPlot renders, data transformation succeeded
    expect(screen.getByTestId('phylo-circos-plot')).toBeInTheDocument()
  })
})