import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CryosectionOverview from './CryosectionOverview'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock data
vi.mock('assets/data/airtable/cryosection.json', () => ({
  default: [
    {
      id: '3',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS3',
        Slide_flat: 'Slide 1',
        Position: 'C1',
        Macrosample: 'M001',
        'Microsample number': 20,
      },
    },
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS1',
        Slide_flat: 'Slide 1',
        Position: 'A1',
        Macrosample: 'M001',
        SlideDate: '2024-01-15',
        'Microsample number': 100,
      },
    },
    {
      id: '2',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS2', // Has no image, so no composition
        Slide_flat: 'Slide 1',
        Position: 'B1',
        Macrosample: 'M001',
        SlideDate: '2024-01-15',
        'Microsample number': 40,
      },
    },
    {
      id: '4',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS4',
        Slide_flat: 'Slide 2',
        Position: 'A1',
        Macrosample: 'M001',
        'Microsample number': 10,
      },
    },
  ],
}))

vi.mock('assets/data/airtable/cryosectionimage.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        ID: 'G_CS1', // Matches the cryosection above
      },
    },
  ],
}))

vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({
  default: [{ fields: { ID: 'M001', Individual: 'G121' } }],
}))

vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [{ fields: { ID: 'G121', Experiment_flat: 'G' } }],
}))

vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [{ fields: { ID: 'G', Name: 'G - Salmonella experiment (chicken)' } }],
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

vi.mock('components/TabComponents/MicrosampleTab', () => ({
  default: ({ id, displayTableDescription }: any) => (
    <div data-testid='microsample-tab' data-description={String(displayTableDescription)}>
      Microsample Tab: {id}
    </div>
  ),
}))

vi.mock('./MicrosampleComposition', () => ({
  default: ({ cryosection, slideSwitcher }: any) => (
    <div data-testid='composition-tab'>
      <div data-testid='composition-heading-row'>{slideSwitcher}<span>Taxonomic Level:</span></div>
      Composition: {cryosection}
    </div>
  ),
}))


describe('CryosectionOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  const renderPage = (cryosectionName = 'G_CS1') => {
    return render(
      <MemoryRouter
        initialEntries={[`/cryosections/${cryosectionName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path='/cryosections/:cryosectionName' element={<CryosectionOverview />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders breadcrumbs', () => {
    renderPage()

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
    expect(screen.getByText('Cryosections')).toBeInTheDocument()
  })

  it('displays cryosection name', () => {
    renderPage()

    const headers = screen.getAllByText('G_CS1')
    expect(headers.length).toBeGreaterThan(0)
  })

  it('shows the cryosection\'s details in a strip below the header', () => {
    renderPage()

    const summary = screen.getByRole('region', { name: 'Cryosection summary' })
    expect(screen.getByRole('banner')).not.toContainElement(summary)

    expect(within(summary).getByText('Trial')).toBeInTheDocument()
    const trialLink = within(summary).getByRole('link', { name: 'G chicken' })
    expect(trialLink).toHaveAttribute('href', '/animal-trials/G%20-%20Salmonella%20experiment%20(chicken)')
    expect(trialLink).toHaveAttribute('title', 'G - Salmonella experiment (chicken)')
    expect(trialLink).toHaveClass('no-underline')
    expect(within(trialLink).getByRole('img', { name: 'chicken' })).toBeInTheDocument()
    expect(within(summary).getByText('Specimen')).toBeInTheDocument()
    const specimenLink = within(summary).getByRole('link', { name: 'G121' })
    expect(specimenLink).toHaveAttribute('href', '/animal-specimens/G121')
    expect(specimenLink).toHaveClass('no-underline')
    expect(within(summary).getByText('Macrosample')).toBeInTheDocument()
    const macrosampleLink = within(summary).getByRole('link', { name: 'M001' })
    expect(macrosampleLink).toHaveAttribute('href', '/macrosamples/M001')
    expect(macrosampleLink).toHaveClass('no-underline')
    expect(within(summary).getByText('Number of microsamples')).toBeInTheDocument()
    expect(within(summary).getByText('100')).toBeInTheDocument()
    expect(within(summary).queryByText('Slide')).not.toBeInTheDocument()
    expect(within(summary).queryByText('Position')).not.toBeInTheDocument()
  })

  it('does not show the slide date', () => {
    renderPage()

    expect(screen.queryByText('2024-01-15')).not.toBeInTheDocument()
    expect(screen.queryByText(/Slide date/)).not.toBeInTheDocument()
  })

  it('switches between cryosections on the same slide in position order', () => {
    renderPage()

    const navigation = screen.getByRole('navigation', { name: 'Cryosections on slide Slide 1' })
    expect(screen.getByTestId('composition-heading-row')).toContainElement(navigation)
    const links = within(navigation).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['G_CS1', 'G_CS2', 'G_CS3'])
    expect(links[0]).toHaveAttribute('aria-current', 'page')
    expect(links[1]).toHaveAttribute('href', '/cryosections/G_CS2')
    expect(within(navigation).queryByRole('link', { name: 'G_CS4' })).not.toBeInTheDocument()

    fireEvent.click(links[1])

    const nextNavigation = screen.getByRole('navigation', { name: 'Cryosections on slide Slide 1' })
    expect(within(nextNavigation).getByRole('link', { name: 'G_CS2' })).toHaveAttribute('aria-current', 'page')
    expect(within(nextNavigation).getByRole('link', { name: 'G_CS1' })).not.toHaveAttribute('aria-current')
    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('G_CS2')
    expect(screen.queryByTestId('composition-tab')).not.toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Cryosection summary' })).getByText('40')).toBeInTheDocument()
  })

  it('hides the slide switcher when the cryosection has no sibling', () => {
    renderPage('G_CS4')

    expect(screen.queryByRole('navigation', { name: /Cryosections on slide/ })).not.toBeInTheDocument()
  })

  it('introduces cryosections and microsamples in the header', () => {
    renderPage()

    const header = screen.getByRole('banner')
    expect(within(header).getByText(/A cryosection is a thin cross-cut of the intestine/)).toBeInTheDocument()
    expect(within(header).getByText(/laser\s+capture\s+microdissection/)).toBeInTheDocument()
  })

  it('shows the composition and then the microsamples, without tabs', () => {
    renderPage()

    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Microsamples' })).not.toBeInTheDocument()

    const composition = screen.getByTestId('composition-tab')
    const microsamples = screen.getByTestId('microsample-tab')
    expect(composition).toHaveTextContent('G_CS1')
    expect(microsamples).toHaveTextContent('G_CS1')
    expect(composition.compareDocumentPosition(microsamples) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('leaves the microsamples\' description out of their table', () => {
    renderPage()

    expect(screen.getByTestId('microsample-tab')).toHaveAttribute('data-description', 'false')
  })

  it('shows only the microsamples for a cryosection without a composition', () => {
    renderPage('G_CS2')

    expect(screen.queryByTestId('composition-tab')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Cryosections on slide Slide 1' })).toBeInTheDocument()
    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('G_CS2')
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
