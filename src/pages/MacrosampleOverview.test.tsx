import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MacrosampleOverview from './MacrosampleOverview'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock data
vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'M001',
        Individual: 'AS001',
        Code: 'CODE123',
        'Sample type': 'Tissue',
        'Data type': 'Metagenomics',
        Description: 'Ileum sample',
        Container: 'Tube',
        Preservative: 'Ethanol',
        Weight: 0.5,
        'ENA accession': ['ERS12345'],
        'ENA link': 'https://example.com/ena',
      },
    },
    {
      id: '2',
      createdTime: '2024-01-01',
      fields: {
        ID: 'M002',
        Individual: 'AS999',
        'Sample type': 'Caecum',
        'Data type': 'Metabolomics',
        Preservative: 'None',
      },
    },
    {
      id: '3',
      createdTime: '2024-01-01',
      fields: {
        ID: 'D003',
        Individual: 'AS998',
        'Sample type': 'Caecum',
        Preservative: 'None',
      },
    },
    {
      id: '4',
      fields: {
        ID: 'G011cJ',
        Individual: 'G011',
        Description: 'Digesta',
        Container: '2 mL tube',
        'Sample type': 'Caecum right',
        'Data type': 'Metagenomics',
        Preservative: 'DNA/RNA Shield',
        'ENA accession': ['ERR15738788'],
        'ENA link': 'https://www.ebi.ac.uk/ena/browser/view/ERR15738788',
      },
    },
  ],
}))

vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [
    { fields: { ID: 'AS001', Experiment_flat: 'G' } },
    { fields: { ID: 'G011', Experiment_flat: 'G' } },
  ],
}))

vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    { fields: { ID: 'G', Name: 'G - Salmonella experiment (chicken)' } },
    { fields: { ID: 'M', Name: 'M - Turkey trial' } },
  ],
}))

vi.mock('assets/data/airtable/macrosample.json', () => ({
  default: [{ fields: { ID: 'D300001', run_accession: 'ERR15738788' } }],
}))

vi.mock('assets/data/airtable/cryosection.json', () => ({
  default: [{ fields: { ID: 'M001A' } }],
}))
vi.mock('assets/data/airtable/microsample.json', () => ({
  default: [{ fields: { Code: 'M001A101' } }, { fields: { Code: 'M002A101' } }],
}))

// Mock components
vi.mock('components/BreadCrumbs', () => ({
  TrailMark: () => <span aria-hidden='true' />,
  default: ({ items }: any) => (
    <div data-testid='breadcrumbs'>
      {items.map((item: any) => <span key={item.label}>{item.label}</span>)}
    </div>
  ),
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}))

vi.mock('components/Tabs', () => ({
  default: ({ tabs, selectedTab, setSelectedTab }: any) => (
    <div data-testid='tabs'>
      {tabs.map((tab: string) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          data-selected={selectedTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('components/EnaRunMetadata', () => ({
  default: ({ accessions }: { accessions: string[] }) => <section data-testid='ena-run-metadata'>ENA sequencing data: {accessions.join(', ')}</section>,
}))

vi.mock('components/SampleTaxonomyOverview', () => ({
  default: ({ kind, sampleId }: { kind: string, sampleId?: string }) => <div>Taxonomy {kind}: {sampleId ?? 'none'}</div>,
}))

vi.mock('components/TabComponents/CryosectionTab', () => ({
  default: ({ id }: any) => <div data-testid='cryosection-tab'>Cryosection Tab: {id}</div>,
}))

vi.mock('components/TabComponents/MicrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid='microsample-tab'>Microsample Tab: {id}</div>,
}))

describe('MacrosampleOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  const renderPage = (macrosampleName = 'M001') => {
    return render(
      <MemoryRouter
        initialEntries={[`/macrosamples/${macrosampleName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path='/macrosamples/:macrosampleName' element={<MacrosampleOverview />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders breadcrumbs', () => {
    renderPage()

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
    expect(screen.getByText('Macrosamples')).toBeInTheDocument()
  })

  it('displays macrosample name', () => {
    renderPage()

    const headers = screen.getAllByText('M001')
    expect(headers.length).toBeGreaterThan(0)
  })

  it('shows four highlights below the header', () => {
    renderPage()

    const summary = screen.getByRole('region', { name: 'Macrosample summary' })
    expect(screen.getByRole('banner')).not.toContainElement(summary)

    expect(within(summary).getByText('Trial')).toBeInTheDocument()
    const trialLink = within(summary).getByRole('link', { name: 'G chicken' })
    expect(trialLink).toHaveAttribute('href', '/animal-trials/G%20-%20Salmonella%20experiment%20(chicken)')
    expect(trialLink).toHaveAttribute('title', 'G - Salmonella experiment (chicken)')
    expect(trialLink).toHaveClass('no-underline')
    expect(within(trialLink).getByRole('img', { name: 'chicken' })).toBeInTheDocument()
    expect(within(summary).getByText('Sample type')).toBeInTheDocument()
    expect(within(summary).getByText('Tissue')).toBeInTheDocument()
    expect(within(summary).getByText('Destination')).toBeInTheDocument()
    expect(within(summary).getByText('Metagenomics')).toBeInTheDocument()
    expect(within(summary).getByText('Preservation')).toBeInTheDocument()
    expect(within(summary).getByText('Ethanol')).toBeInTheDocument()
    expect(screen.queryByText('CODE123')).not.toBeInTheDocument()
    expect(within(summary).queryByText('Ileum sample')).not.toBeInTheDocument()
  })

  it('displays ENA accession beside the title', () => {
    renderPage()

    const header = screen.getByRole('banner')
    expect(within(header).getByText('ENA accession:')).toBeInTheDocument()
    const link = within(header).getByRole('link', { name: 'ERS12345' })
    expect(link).toHaveAttribute('href', 'https://example.com/ena')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows metabolomics destination and falls back to the ID for an unlinked specimen', () => {
    renderPage('M002')

    const summary = screen.getByRole('region', { name: 'Macrosample summary' })
    expect(within(summary).getByRole('link', { name: 'M turkey' }))
      .toHaveAttribute('href', '/animal-trials/M%20-%20Turkey%20trial')
    expect(within(summary).getByText('Metabolomics')).toBeInTheDocument()
    expect(within(summary).getByText('None')).toBeInTheDocument()
    expect(within(screen.getByRole('banner')).queryByText('ENA accession:')).not.toBeInTheDocument()
  })

  it('leaves the trial letter unlinked when no trial page exists', () => {
    renderPage('D003')

    const summary = screen.getByRole('region', { name: 'Macrosample summary' })
    expect(within(summary).getByText('D')).toBeInTheDocument()
    expect(within(summary).queryByRole('link', { name: 'D' })).not.toBeInTheDocument()
  })

  it('renders tabs', () => {
    renderPage()

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByText('Cryosections')).toBeInTheDocument()
    expect(screen.getByText('Microsamples')).toBeInTheDocument()
  })

  it('shows Cryosections tab by default', () => {
    renderPage()

    expect(screen.getByTestId('cryosection-tab')).toBeInTheDocument()
    expect(screen.getByTestId('cryosection-tab')).toHaveTextContent('M001')
  })

  it('switches to Microsamples tab when clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    const microsamplesButton = screen.getByText('Microsamples')
    await user.click(microsamplesButton)

    expect(screen.getByTestId('microsample-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('cryosection-tab')).not.toBeInTheDocument()
  })

  it('shows microsamples directly when there are no cryosections', () => {
    renderPage('M002')

    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('M002')
    expect(screen.queryByRole('button', { name: 'Cryosections' })).not.toBeInTheDocument()
  })

  it('omits tabs when a macrosample has no linked data', () => {
    renderPage('D003')

    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cryosection-tab')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sample details' })).toBeInTheDocument()
    expect(screen.queryByText(/No ENA run is linked/)).not.toBeInTheDocument()
  })

  it('shows the linked ENA run without an empty child section for G011cJ', () => {
    renderPage('G011cJ')

    const main = screen.getByRole('main')
    expect(within(main).getByTestId('ena-run-metadata')).toHaveTextContent('ERR15738788')
    expect(within(main).getByText('Taxonomy macro: D300001')).toBeInTheDocument()
    expect(within(main).queryByRole('heading', { name: 'Sample details' })).not.toBeInTheDocument()
    expect(within(main).queryByText(/No cryosections or microsamples are linked/)).not.toBeInTheDocument()
    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument()
  })

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderPage()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })
})
