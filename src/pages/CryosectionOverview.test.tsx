import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CryosectionOverview from './CryosectionOverview'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock data
vi.mock('assets/data/airtable/cryosection.json', () => ({
  default: [
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
  default: ({ cryosection }: any) => <div data-testid='composition-tab'>Composition: {cryosection}</div>,
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

    expect(within(summary).getByText('Slide')).toBeInTheDocument()
    expect(within(summary).getByText('Slide 1')).toBeInTheDocument()
    expect(within(summary).getByText('Position')).toBeInTheDocument()
    expect(within(summary).getByText('A1')).toBeInTheDocument()
    expect(within(summary).getByText('Macrosample')).toBeInTheDocument()
    expect(within(summary).getByText('M001')).toBeInTheDocument()
    expect(within(summary).getByText('Number of microsamples')).toBeInTheDocument()
    expect(within(summary).getByText('100')).toBeInTheDocument()
  })

  it('does not show the slide date', () => {
    renderPage()

    expect(screen.queryByText('2024-01-15')).not.toBeInTheDocument()
    expect(screen.queryByText(/Slide date/)).not.toBeInTheDocument()
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