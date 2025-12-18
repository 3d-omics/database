import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
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

vi.mock('components/TabComponents/MicrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid='microsample-tab'>Microsample Tab: {id}</div>,
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

  it('displays cryosection details', () => {
    renderPage()

    expect(screen.getByText('Slide 1')).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('M001')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders tabs with composition when data exists', () => {
    renderPage()

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByText('Microsamples')).toBeInTheDocument()
    expect(screen.getByText('Microsamples Community Composition')).toBeInTheDocument()
  })

  it('shows Microsamples tab by default', () => {
    renderPage()

    expect(screen.getByTestId('microsample-tab')).toBeInTheDocument()
    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('G_CS1')
  })

  it('switches to Community Composition tab when clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    const compositionButton = screen.getByText('Microsamples Community Composition')
    await user.click(compositionButton)

    expect(screen.getByTestId('composition-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('microsample-tab')).not.toBeInTheDocument()
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