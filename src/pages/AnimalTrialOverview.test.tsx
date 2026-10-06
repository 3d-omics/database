import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AnimalTrialOverview from './AnimalTrialOverview'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock data
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'EXP001',
        Name: 'Experiment G',
        StartDate: '2024-01-01',
        EndDate: '2024-03-31',
        Type: 'Poultry',
        'Bioproject accession': 'PRJNA12345',
        'Bioproject link': 'https://example.com/bioproject',
        'Trial description': 'Line 1\nLine 2\nLine 3',
      },
    },
    { id: '2', fields: { ID: 'EXP002', Name: 'Experiment H' } },
    { id: '3', fields: { ID: 'EXP003', Name: 'Experiment I' } },
  ],
}))

vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [{ fields: { ID: 'EXP001a', Experiment_flat: 'EXP001' } }],
}))
vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({
  default: [{ fields: { ID: 'EXP001aF' } }],
}))
vi.mock('assets/data/airtable/cryosection.json', () => ({
  default: [{ fields: { ID: 'EXP001aFA' } }],
}))
vi.mock('assets/data/airtable/microsample.json', () => ({
  default: [{ fields: { Code: 'EXP001aFA101' } }, { fields: { Code: 'EXP002aFA101' } }],
}))

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

vi.mock('../components/TabComponents/AnimalSpecimenTab', () => ({
  default: ({ experimentId }: any) => <div data-testid='animal-specimen-tab'>Animal Specimen Tab: {experimentId}</div>,
}))

vi.mock('components/TabComponents/MacrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid='macrosample-tab'>Macrosample Tab: {id}</div>,
}))

vi.mock('components/TabComponents/CryosectionTab', () => ({
  default: ({ id }: any) => <div data-testid='cryosection-tab'>Cryosection Tab: {id}</div>,
}))

vi.mock('components/TabComponents/MicrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid='microsample-tab'>Microsample Tab: {id}</div>,
}))


describe('AnimalTrialOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  const renderPage = (experimentName = 'Experiment G') => {
    return render(
      <MemoryRouter
        initialEntries={[`/animal-trials/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path='/animal-trials/:experimentName' element={<AnimalTrialOverview />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders breadcrumbs', () => {
    renderPage()

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
    expect(screen.getByText('Animal Trials')).toBeInTheDocument()
  })

  it('displays experiment name', () => {
    renderPage()

    const headers = screen.getAllByText('Experiment G')
    expect(headers.length).toBeGreaterThan(0)
  })

  it('displays MAG Catalogue link', () => {
    renderPage()

    const link = screen.getByRole('link', { name: /view MAG Catalogue/i })
    expect(link).toHaveAttribute('href', '/mag-catalogues/Experiment%20G')
  })

  it('displays experiment details', () => {
    renderPage()

    expect(screen.getByText(/Trial ID:/)).toBeInTheDocument()
    expect(screen.getByText('EXP001')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    expect(screen.getByText('2024-03-31')).toBeInTheDocument()
  })

  it('displays bioproject accession link', () => {
    renderPage()

    const link = screen.getByRole('link', { name: 'PRJNA12345' })
    expect(link).toHaveAttribute('href', 'https://example.com/bioproject')
  })

  it('displays trial description with line breaks', () => {
    renderPage()

    expect(screen.getByText('Line 1')).toBeInTheDocument()
    expect(screen.getByText('Line 2')).toBeInTheDocument()
    expect(screen.getByText('Line 3')).toBeInTheDocument()
  })

  it('renders tabs', () => {
    renderPage()

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByText('Animal Specimens')).toBeInTheDocument()
    expect(screen.getByText('Macrosamples')).toBeInTheDocument()
    expect(screen.getByText('Cryosections')).toBeInTheDocument()
    expect(screen.getByText('Microsamples')).toBeInTheDocument()
  })

  it('shows Animal Specimens tab by default', () => {
    renderPage()

    expect(screen.getByTestId('animal-specimen-tab')).toBeInTheDocument()
    expect(screen.getByTestId('animal-specimen-tab')).toHaveTextContent('EXP001')
  })

  it('switches to Macrosamples tab when clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    const macrosamplesButton = screen.getByText('Macrosamples')
    await user.click(macrosamplesButton)

    expect(screen.getByTestId('macrosample-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('animal-specimen-tab')).not.toBeInTheDocument()
  })

  it('switches to Cryosections tab when clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    const cryosectionsButton = screen.getByText('Cryosections')
    await user.click(cryosectionsButton)

    expect(screen.getByTestId('cryosection-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('animal-specimen-tab')).not.toBeInTheDocument()
  })

  it('shows only the populated tab when a trial has one kind of linked data', () => {
    renderPage('Experiment H')

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Microsamples' })).toBeInTheDocument()
    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('EXP002')
    expect(screen.queryByRole('button', { name: 'Animal Specimens' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Macrosamples' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cryosections' })).not.toBeInTheDocument()
  })

  it('omits tabs when a trial has no linked data', () => {
    renderPage('Experiment I')

    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument()
    expect(screen.queryByTestId('animal-specimen-tab')).not.toBeInTheDocument()
    expect(screen.getByRole('main')).toBeEmptyDOMElement()
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
