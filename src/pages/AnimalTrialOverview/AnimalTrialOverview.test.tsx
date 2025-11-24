import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi, Mock } from 'vitest'
import AnimalTrialOverview from './index'

// Mock useParams
const mockUseParams = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useParams: () => mockUseParams(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>
  }
})

// Mock child tab components
vi.mock('./components/AnimalSpecimenTab', () => ({
  default: ({ experimentId }: { experimentId: string }) => (
    <div data-testid="animal-specimen-tab">Animal Specimen Tab - {experimentId}</div>
  ),
}))

vi.mock('./components/MacrosampleTab', () => ({
  default: ({ experimentId }: { experimentId: string }) => (
    <div data-testid="macrosample-tab">Macrosample Tab - {experimentId}</div>
  ),
}))

vi.mock('./components/MicrosampleTab', () => ({
  default: ({ experimentId }: { experimentId: string }) => (
    <div data-testid="microsample-tab">Microsample Tab - {experimentId}</div>
  ),
}))

// Mock other components
vi.mock('components/Tabs', () => ({
  default: ({ selectedTab, setSelectedTab, tabs }: any) => (
    <div data-testid="tabs">
      {tabs.map((tab: string) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={selectedTab === tab ? 'tab-active' : '!border-gray-200'}
        >
          {tab}
        </button>
      ))}
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
    if (validating) return <div data-testid="loading-dots">Loading...</div>
    if (notFound) return <div>404</div>
    return <div>{children}</div>
  },
}))

// Mock useValidateParams
const mockUseValidateParams = vi.fn()
vi.mock('hooks/useValidateParams', () => ({
  default: () => mockUseValidateParams(),
}))

// Mock static JSON data - define inline
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: 'rec1',
      createdTime: '2023-01-01T00:00:00.000Z',
      fields: {
        ID: 'B',
        Name: 'B - Proof-of-principle chicken trial A',
        StartDate: '2023-01-01',
        EndDate: '2023-02-01',
        Type: 'In vivo',
      },
    },
    {
      id: 'rec2',
      createdTime: '2023-02-01T00:00:00.000Z',
      fields: {
        ID: 'A',
        Name: 'A - Another Experiment',
        StartDate: '2023-03-01',
        EndDate: '2023-04-01',
        Type: 'In vitro',
      },
    },
  ],
}))

describe('AnimalTrialOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    mockUseParams.mockReturnValue({ 
      experimentName: 'B - Proof-of-principle chicken trial A' 
    })
    
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  it('renders loading indicator when validating', () => {
    mockUseValidateParams.mockReturnValue({
      validating: true,
      notFound: false,
    })

    render(<AnimalTrialOverview />)

    expect(screen.getByTestId('loading-dots')).toBeInTheDocument()
  })

  it('renders 404 page when experiment not found', () => {
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: true,
    })

    render(<AnimalTrialOverview />)

    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders 404 when experimentName does not match any data', () => {
    mockUseParams.mockReturnValue({ 
      experimentName: 'Nonexistent Experiment' 
    })
    
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })

    render(<AnimalTrialOverview />)

    // Should not render main content
    expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument()
  })

  it('renders main content and tabs when data is available', () => {
    render(<AnimalTrialOverview />)

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    
    // Check for experiment name (appears in header and breadcrumbs)
    const experimentNames = screen.getAllByText('B - Proof-of-principle chicken trial A')
    expect(experimentNames.length).toBeGreaterThanOrEqual(1)
    
    expect(screen.getByText('view MAG Catalogue')).toBeInTheDocument()
    expect(screen.getByText(/Experiment ID:/)).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText(/Start date:/)).toBeInTheDocument()
    expect(screen.getByText('2023-01-01')).toBeInTheDocument()
    expect(screen.getByText(/End date:/)).toBeInTheDocument()
    expect(screen.getByText('2023-02-01')).toBeInTheDocument()
  })

  it('renders breadcrumbs with correct links', () => {
    render(<AnimalTrialOverview />)

    const breadcrumbs = screen.getByTestId('breadcrumbs')
    expect(breadcrumbs).toHaveTextContent(
      'Home > Animal Trial/Experiment > B - Proof-of-principle chicken trial A'
    )
  })

  it('renders MAG Catalogue link with correct URL', () => {
    render(<AnimalTrialOverview />)

    const magLink = screen.getByText('view MAG Catalogue')
    expect(magLink).toHaveAttribute(
      'href',
      '/genome-catalogues/B%20-%20Proof-of-principle%20chicken%20trial%20A'
    )
  })

  it('displays default tab (Animal Specimen) on initial render', () => {
    render(<AnimalTrialOverview />)

    expect(screen.getByTestId('animal-specimen-tab')).toBeInTheDocument()
    expect(screen.getByTestId('animal-specimen-tab')).toHaveTextContent('Animal Specimen Tab - B')
    expect(screen.queryByTestId('macrosample-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('microsample-tab')).not.toBeInTheDocument()
  })

  it('switches tabs when tab buttons are clicked', () => {
    render(<AnimalTrialOverview />)

    const tabs = screen.getByTestId('tabs')
    const animalSpecimenTab = within(tabs).getByText('Animal Specimen')
    const macrosampleTab = within(tabs).getByText('Macrosample')
    const microsampleTab = within(tabs).getByText('Microsample')

    // Default tab is Animal Specimen
    expect(animalSpecimenTab).toHaveClass('tab-active')
    expect(macrosampleTab).toHaveClass('!border-gray-200')
    expect(microsampleTab).toHaveClass('!border-gray-200')
    expect(screen.getByTestId('animal-specimen-tab')).toBeInTheDocument()

    // Switch to Macrosample tab
    fireEvent.click(macrosampleTab)
    expect(animalSpecimenTab).toHaveClass('!border-gray-200')
    expect(macrosampleTab).toHaveClass('tab-active')
    expect(microsampleTab).toHaveClass('!border-gray-200')
    expect(screen.getByTestId('macrosample-tab')).toBeInTheDocument()
    expect(screen.getByTestId('macrosample-tab')).toHaveTextContent('Macrosample Tab - B')

    // Switch to Microsample tab
    fireEvent.click(microsampleTab)
    expect(animalSpecimenTab).toHaveClass('!border-gray-200')
    expect(macrosampleTab).toHaveClass('!border-gray-200')
    expect(microsampleTab).toHaveClass('tab-active')
    expect(screen.getByTestId('microsample-tab')).toBeInTheDocument()
    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('Microsample Tab - B')
  })

  it('passes correct experimentId to tab components', () => {
    render(<AnimalTrialOverview />)

    const tabs = screen.getByTestId('tabs')

    // Check Animal Specimen tab
    expect(screen.getByTestId('animal-specimen-tab')).toHaveTextContent('Animal Specimen Tab - B')

    // Switch to Macrosample and check
    fireEvent.click(within(tabs).getByText('Macrosample'))
    expect(screen.getByTestId('macrosample-tab')).toHaveTextContent('Macrosample Tab - B')

    // Switch to Microsample and check
    fireEvent.click(within(tabs).getByText('Microsample'))
    expect(screen.getByTestId('microsample-tab')).toHaveTextContent('Microsample Tab - B')
  })

  it('handles case-insensitive experiment name matching', () => {
    mockUseParams.mockReturnValue({ 
      experimentName: 'b - proof-of-principle chicken trial a' // lowercase
    })

    render(<AnimalTrialOverview />)

    // Should still find and render the experiment
    expect(screen.getByText(/Experiment ID:/)).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('renders all three tabs in the tab list', () => {
    render(<AnimalTrialOverview />)

    const tabs = screen.getByTestId('tabs')
    expect(within(tabs).getByText('Animal Specimen')).toBeInTheDocument()
    expect(within(tabs).getByText('Macrosample')).toBeInTheDocument()
    expect(within(tabs).getByText('Microsample')).toBeInTheDocument()
  })

  it('displays experiment metadata correctly', () => {
    render(<AnimalTrialOverview />)

    expect(screen.getByText(/Experiment ID:/)).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    
    expect(screen.getByText(/Start date:/)).toBeInTheDocument()
    expect(screen.getByText('2023-01-01')).toBeInTheDocument()
    
    expect(screen.getByText(/End date:/)).toBeInTheDocument()
    expect(screen.getByText('2023-02-01')).toBeInTheDocument()
  })

  it('works with different experiment data', () => {
    mockUseParams.mockReturnValue({ 
      experimentName: 'A - Another Experiment' 
    })

    render(<AnimalTrialOverview />)

    expect(screen.getByText(/Experiment ID:/)).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('2023-03-01')).toBeInTheDocument()
    expect(screen.getByText('2023-04-01')).toBeInTheDocument()
    expect(screen.getByTestId('animal-specimen-tab')).toHaveTextContent('Animal Specimen Tab - A')
  })

  it('handles undefined experimentName gracefully', () => {
    mockUseParams.mockReturnValue({ 
      experimentName: undefined 
    })

    render(<AnimalTrialOverview />)

    // Should not crash, just not render content
    expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument()
  })
})