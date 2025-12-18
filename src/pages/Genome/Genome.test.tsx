import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Genome from './index'
import useValidateParams from 'hooks/useValidateParams'
import { useGenomeJsonFile, useAllMicrosampleCounts } from 'hooks/useJsonData'

// Mock hooks
vi.mock('hooks/useValidateParams')
vi.mock('hooks/useJsonData')

// Mock components
vi.mock('components/Tabs', () => ({
  default: ({ selectedTab, setSelectedTab, tabs }: any) => (
    <div data-testid='tabs'>
      {tabs.map((tab: string) => (
        <button key={tab} onClick={() => setSelectedTab(tab)}>
          {tab}
        </button>
      ))}
      <span>Selected: {selectedTab}</span>
    </div>
  ),
}))

vi.mock('components/BreadCrumbs', () => ({
  default: () => <div data-testid='breadcrumbs'>BreadCrumbs</div>,
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}))

vi.mock('./components/MacrosampleTab', () => ({
  default: ({ genomeName }: any) => <div data-testid='macrosample-tab'>Macrosample for {genomeName}</div>,
}))

vi.mock('./components/MicrosampleTab', () => ({
  default: ({ genomeName }: any) => <div data-testid='microsample-tab'>Microsample for {genomeName}</div>,
}))

vi.mock('pages/NotFound', () => ({
  default: () => <div data-testid='not-found'>Not Found</div>,
}))

// Mock data imports
vi.mock('assets/data/airtable/macrosample.json', () => ({ default: [] }))
vi.mock('assets/data/airtable/microsampleswithcoordination.json', () => ({ default: [] }))


describe('Genome', () => {
  const mockGenomeMetadata = {
    genome: ['Genome1', 'Genome2'],
    domain: ['d__Bacteria', 'd__Bacteria'],
    phylum: ['p__Firmicutes', 'p__Proteobacteria'],
    class: ['c__Bacilli', 'c__Gammaproteobacteria'],
    order: ['o__Lactobacillales', 'o__Enterobacterales'],
    family: ['f__Lactobacillaceae', 'f__Enterobacteriaceae'],
    genus: ['g__Lactobacillus', 'g__Escherichia'],
    species: ['s__Lactobacillus_acidophilus', 's__Escherichia_coli'],
    completeness: [95, 98],
    contamination: [2, 1],
    length: [2000000, 4500000],
  }

  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    });

    (useGenomeJsonFile as any).mockReturnValue(mockGenomeMetadata);
    (useAllMicrosampleCounts as any).mockReturnValue([])
  })

  const renderGenome = (genomeName = 'Genome1', experimentName = 'Experiment G') => {
    return render(
      <MemoryRouter
        initialEntries={[`/genome/${experimentName}/${genomeName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path='/genome/:experimentName/:genomeName' element={<Genome />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders genome page with data', () => {
    renderGenome('Genome1', 'Experiment G')
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })

  it('displays genome name as header', () => {
    renderGenome('Genome1', 'Experiment G')
    expect(screen.getByText('Genome1')).toBeInTheDocument()
  })

  it('displays taxonomic lineage', () => {
    renderGenome('Genome1')
    expect(screen.getByText('Bacteria')).toBeInTheDocument()
    expect(screen.getByText('Firmicutes')).toBeInTheDocument()
    expect(screen.getByText('Bacilli')).toBeInTheDocument()
  })

  it('displays genome stats', () => {
    renderGenome('Genome1')
    expect(screen.getByText(/Completeness:/i)).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText(/Contamination:/i)).toBeInTheDocument()
    expect(screen.getByText('2%')).toBeInTheDocument()
  })

  it('renders tabs for Macrosample and Microsample', () => {
    renderGenome('Genome1')
    expect(screen.getByText('Macrosample')).toBeInTheDocument()
    expect(screen.getByText('Microsample')).toBeInTheDocument()
  })

  it('shows Macrosample tab by default', () => {
    renderGenome('Genome1')
    expect(screen.getByTestId('macrosample-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('microsample-tab')).not.toBeInTheDocument()
  })

  it('switches to Microsample tab when clicked', async () => {
    const user = userEvent.setup()
    renderGenome('Genome1')

    await user.click(screen.getByText('Microsample'))

    expect(screen.getByTestId('microsample-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('macrosample-tab')).not.toBeInTheDocument()
  })

  it('shows NotFound when genome metadata not found', () => {
    (useGenomeJsonFile as any).mockReturnValue(null)

    renderGenome('Genome1')

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('shows NotFound when genome name not in metadata', () => {
    renderGenome('NonExistentGenome')
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('cleans taxonomy prefixes from display', () => {
    renderGenome('Genome1')

    // Should remove p__, c__, etc. prefixes
    expect(screen.queryByText('p__Firmicutes')).not.toBeInTheDocument()
    expect(screen.getByText('Firmicutes')).toBeInTheDocument()
  })
})