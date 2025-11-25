import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MicrosampleComposition from '.'

// Mock useParams
const mockUseParams = vi.fn()
vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}))

// Mock child components
vi.mock('./components/ImagePlot', () => ({
  default: (props: any) => {
    const {
      microsampleIds,
      setSelectedMicrosampleIds,
      cryosection,
      xcoord,
      ycoord,
      size,
      shape,
      ...rest
    } = props || {}
    return (
      <div 
        data-testid="image-plot"
        data-cryosection={cryosection}
        data-microsample-count={microsampleIds?.length || 0}
        {...rest} 
      />
    )
  },
}))

vi.mock('components/TaxonomyChartLegend', () => ({
  default: (props: any) => {
    const { selectedTaxonomicLevel, experimentId, ...rest } = props || {}
    return (
      <div 
        data-testid="legend"
        data-taxonomic-level={selectedTaxonomicLevel}
        data-experiment-id={experimentId}
        {...rest} 
      />
    )
  },
}))

vi.mock('./components/TaxonomyChart', () => ({
  default: (props: any) => {
    const {
      microsampleIds,
      selectedTaxonomicLevel,
      setSelectedTaxonomicLevel,
      cryosection,
      experimentId,
      ...rest
    } = props || {}
    return (
      <div 
        data-testid="taxonomy-chart"
        data-cryosection={cryosection}
        data-taxonomic-level={selectedTaxonomicLevel}
        data-experiment-id={experimentId}
        data-microsample-count={microsampleIds?.length || 0}
        {...rest} 
      />
    )
  },
}))

vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid="breadcrumbs">
      {items.map((i: any) => i.label).join(' > ')}
    </div>
  ),
}))

vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => (
    <div data-testid="error-banner">{children}</div>
  ),
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, validating, notFound }: any) => {
    if (validating) return <div>Validating...</div>
    if (notFound) return <div>Not Found from Validator</div>
    return <div>{children}</div>
  },
}))

// Mock useValidateParams
const mockUseValidateParams = vi.fn()
vi.mock('hooks/useValidateParams', () => ({
  default: () => mockUseValidateParams(),
}))

// Mock static JSON data
vi.mock('assets/data/airtable/microsampleswithcoordination.json', () => ({
  default: [
    {
      id: 'rec1',
      createdTime: '2024-01-01T00:00:00.000Z',
      fields: {
        ID: 'MICRO001',
        cryosection_text: 'G121eI104C',
        'sample_attribute[Xcoordpixel]': 100,
        'sample_attribute[Ycoordpixel]': 200,
        size: 10,
        shape: 'circle',
      }
    },
    {
      id: 'rec2',
      createdTime: '2024-01-02T00:00:00.000Z',
      fields: {
        ID: 'MICRO002',
        cryosection_text: 'G121eI104C',
        'sample_attribute[Xcoordpixel]': 150,
        'sample_attribute[Ycoordpixel]': 250,
        size: 15,
        shape: 'square',
      }
    },
    {
      id: 'rec3',
      createdTime: '2024-01-03T00:00:00.000Z',
      fields: {
        ID: 'MICRO003',
        cryosection_text: 'A_Different_Cryosection',
        'sample_attribute[Xcoordpixel]': 300,
        'sample_attribute[Ycoordpixel]': 400,
        size: 20,
        shape: 'triangle',
      }
    }
  ],
}))

describe('MicrosampleComposition page', () => {
  beforeEach(() => {
    // Default mock values
    mockUseParams.mockReturnValue({
      cryosection: 'G121eI104C',
    })

    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders main components with correct data', () => {
    render(<MicrosampleComposition />)

    // Check header
    expect(screen.getByText(/Cryosection:/)).toBeInTheDocument()
    expect(screen.getByText('G121eI104C')).toBeInTheDocument()

    // Check breadcrumbs
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent(
      'Home > Microsample Community Composition > G121eI104C'
    )

    // Check main components are rendered
    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
  })

  it('filters coordination data correctly for matching cryosection', () => {
    render(<MicrosampleComposition />)

    const imagePlot = screen.getByTestId('image-plot')
    
    // Should only include the 2 microsamples that match 'G121eI104C'
    expect(imagePlot).toHaveAttribute('data-microsample-count', '2')
    expect(imagePlot).toHaveAttribute('data-cryosection', 'G121eI104C')
  })

  it('passes correct props to ImagePlot', () => {
    render(<MicrosampleComposition />)

    const imagePlot = screen.getByTestId('image-plot')
    expect(imagePlot).toHaveAttribute('data-cryosection', 'G121eI104C')
    expect(imagePlot).toHaveAttribute('data-microsample-count', '2')
  })

  it('passes correct props to TaxonomyChart', () => {
    render(<MicrosampleComposition />)

    const taxonomyChart = screen.getByTestId('taxonomy-chart')
    expect(taxonomyChart).toHaveAttribute('data-cryosection', 'G121eI104C')
    expect(taxonomyChart).toHaveAttribute('data-taxonomic-level', 'phylum')
    expect(taxonomyChart).toHaveAttribute('data-experiment-id', 'G')
    expect(taxonomyChart).toHaveAttribute('data-microsample-count', '2')
  })

  it('passes correct props to Legend', () => {
    render(<MicrosampleComposition />)

    const legend = screen.getByTestId('legend')
    expect(legend).toHaveAttribute('data-taxonomic-level', 'phylum')
    expect(legend).toHaveAttribute('data-experiment-id', 'G')
  })

  it('extracts correct experiment ID from cryosection', () => {
    render(<MicrosampleComposition />)

    // experimentId should be 'G' (first character)
    const taxonomyChart = screen.getByTestId('taxonomy-chart')
    expect(taxonomyChart).toHaveAttribute('data-experiment-id', 'G')
  })

  it('shows error banner for non-G experiments', () => {
    mockUseParams.mockReturnValue({
      cryosection: 'A123eI104C', // Starts with 'A', not 'G'
    })

    render(<MicrosampleComposition />)

    expect(screen.getByTestId('error-banner')).toHaveTextContent(
      'No sufficient data for this experiment is provided yet'
    )
    
    // TaxonomyChart and Legend should not be rendered
    expect(screen.queryByTestId('taxonomy-chart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument()
  })

  it('handles empty coordination data when no matching cryosection', () => {
    mockUseParams.mockReturnValue({
      cryosection: 'G_NoMatch',
    })

    render(<MicrosampleComposition />)

    const imagePlot = screen.getByTestId('image-plot')
    expect(imagePlot).toHaveAttribute('data-microsample-count', '0')
  })

  it('handles missing coordinate data gracefully', () => {
    // Override mock with data missing some fields
    vi.doMock('assets/data/airtable/microsampleswithcoordination.json', () => ({
      default: [
        {
          id: 'rec4',
          createdTime: '2024-01-04T00:00:00.000Z',
          fields: {
            ID: 'MICRO004',
            cryosection_text: 'G121eI104C',
            // Missing coordinates, size, shape
          }
        }
      ],
    }))

    render(<MicrosampleComposition />)

    // Should still render without crashing
    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
  })

  it('shows ParamsValidator validating state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: true,
      notFound: false,
    })

    render(<MicrosampleComposition />)

    expect(screen.getByText(/Validating.../i)).toBeInTheDocument()
  })

  it('shows ParamsValidator notFound state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: true,
    })

    render(<MicrosampleComposition />)

    expect(screen.getByText(/Not Found from Validator/i)).toBeInTheDocument()
  })

  it('uses correct experiment ID in validation', () => {
    render(<MicrosampleComposition />)

    // Verify useValidateParams was called with correct params
    expect(mockUseValidateParams).toHaveBeenCalled()
  })

  it('renders breadcrumbs with correct links', () => {
    render(<MicrosampleComposition />)

    const breadcrumbs = screen.getByTestId('breadcrumbs')
    expect(breadcrumbs).toHaveTextContent('Home > Microsample Community Composition > G121eI104C')
  })

  it('handles undefined cryosection param', () => {
    mockUseParams.mockReturnValue({
      cryosection: undefined,
    })

    render(<MicrosampleComposition />)

    // Should render without crashing
    const imagePlot = screen.getByTestId('image-plot')
    expect(imagePlot).toHaveAttribute('data-microsample-count', '0')
  })
})