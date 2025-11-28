import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import MacrosampleComposition from '.'

const mockUseParams = vi.fn()
vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}))

const mockUseValidateParams = vi.fn()
vi.mock('hooks/useValidateParams', () => ({
  default: () => mockUseValidateParams(),
}))

vi.mock('./components/TaxonomyChart', () => ({
  default: ({ experimentId, selectedTaxonomicLevel }: any) => (
    <div data-testid="taxonomy-chart">
      Chart - {experimentId} - {selectedTaxonomicLevel}
    </div>
  ),
}))

vi.mock('components/TaxonomyChartLegend', () => ({
  default: ({ experimentId, selectedTaxonomicLevel }: any) => (
    <div data-testid="legend">
      Legend - {experimentId} - {selectedTaxonomicLevel}
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
    if (validating) return <div>Loading...</div>
    if (notFound) return <div>404</div>
    return <div>{children}</div>
  },
}))

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => (
    <div data-testid="error-banner">{children}</div>
  ),
}))

describe('MacrosampleComposition', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  it('renders chart and legend for experiment G', () => {
    mockUseParams.mockReturnValue({ experimentName: 'G_experiment' })

    render(<MacrosampleComposition />)

    expect(screen.getByText(/Macrosample Community Composition: G_experiment/)).toBeInTheDocument()
    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
  })

  it('renders chart and legend for experiment H', () => {
    mockUseParams.mockReturnValue({ experimentName: 'H_experiment' })

    render(<MacrosampleComposition />)

    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
  })

  it('passes correct props to child components', () => {
    mockUseParams.mockReturnValue({ experimentName: 'G_experiment' })

    render(<MacrosampleComposition />)

    expect(screen.getByTestId('taxonomy-chart')).toHaveTextContent('Chart - G - phylum')
    expect(screen.getByTestId('legend')).toHaveTextContent('Legend - G - phylum')
  })
})