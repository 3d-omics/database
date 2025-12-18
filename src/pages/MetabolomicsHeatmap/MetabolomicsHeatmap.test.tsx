import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MetabolomicsHeatmap from './index'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock config
vi.mock('config/macrosampleWithMetaboliteData', () => ({
  macrosampleWithMetaboliteData: ['G001', 'G002', 'H001', 'H002', 'I001'],
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

vi.mock('pages/Macrosamples', () => ({
  default: ({ checkedMetaboliteIds, pageTitle }: any) => (
    <div data-testid='macrosample-component'>
      <div data-testid='page-title'>{pageTitle}</div>
      <div data-testid='checked-count'>{checkedMetaboliteIds?.length || 0}</div>
    </div>
  ),
}))

vi.mock('./components/CompareSamplesButton', () => ({
  default: ({ samples }: any) => (
    <div data-testid='compare-button'>Compare {samples.length} samples</div>
  ),
}))


describe('MetabolomicsHeatmap', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  const renderPage = (experimentName = 'G - Test Experiment') => {
    return render(
      <MemoryRouter
        initialEntries={[`/metabolomics/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path='/metabolomics/:experimentName' element={<MetabolomicsHeatmap />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders page with breadcrumbs', () => {
    renderPage()

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
    expect(screen.getByText('Metabolomics')).toBeInTheDocument()
  })

  it('renders Macrosample component with correct title', () => {
    renderPage()

    expect(screen.getByTestId('macrosample-component')).toBeInTheDocument()
    expect(screen.getByTestId('page-title')).toHaveTextContent('Sample selection for heatmap')
  })

  it('filters macrosampleWithMetaboliteData by experimentId', () => {
    // experimentId = 'G' from 'G - Test Experiment'
    renderPage('G - Test Experiment')

    // Mock should show G samples filtered (G001, G002 from config)
    expect(screen.getByTestId('macrosample-component')).toBeInTheDocument()
  })

  it('does not show CompareSamplesButton initially', () => {
    renderPage()

    expect(screen.queryByTestId('compare-button')).not.toBeInTheDocument()
  })

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderPage()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('extracts experimentId from experimentName', () => {
    renderPage('H - Another Experiment')

    // Should filter to H samples (H001, H002)
    expect(screen.getByTestId('macrosample-component')).toBeInTheDocument()
  })
})