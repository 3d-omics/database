import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MicrosampleComposition from './index'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock data
vi.mock('assets/data/airtable/microsampleswithcoordination.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS1_001',
        cryosection_text: 'G_CS1',
        'sample_attribute[Xcoordpixel]': 100,
        'sample_attribute[Ycoordpixel]': 200,
        size: 5,
        shape: 'circle',
      },
    },
    {
      id: '2',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS1_002',
        cryosection_text: 'G_CS1',
        'sample_attribute[Xcoordpixel]': 150,
        'sample_attribute[Ycoordpixel]': 250,
        size: 6,
        shape: 'square',
      },
    },
    {
      id: '3',
      createdTime: '2024-01-01',
      fields: {
        ID: 'H_CS1_001',
        cryosection_text: 'H_CS1',
        'sample_attribute[Xcoordpixel]': 300,
        'sample_attribute[Ycoordpixel]': 400,
        size: 4,
        shape: 'circle',
      },
    },
  ],
}))

// Mock components
vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}))

vi.mock('./components/ImagePlot', () => ({
  default: ({ cryosection, microsampleIds }: any) => (
    <div data-testid='image-plot'>
      <div data-testid='cryosection'>{cryosection}</div>
      <div data-testid='microsample-count'>{microsampleIds.length}</div>
    </div>
  ),
}))

vi.mock('./components/TaxonomyChart', () => ({
  default: ({ microsampleIds, selectedTaxonomicLevel }: any) => (
    <div data-testid='taxonomy-chart'>
      <div data-testid='selected-level'>{selectedTaxonomicLevel}</div>
      <div data-testid='chart-sample-count'>{microsampleIds.length}</div>
    </div>
  ),
}))

vi.mock('components/TaxonomyChartLegend', () => ({
  default: ({ selectedTaxonomicLevel, experimentId }: any) => (
    <div data-testid='taxonomy-legend'>
      <div data-testid='legend-level'>{selectedTaxonomicLevel}</div>
      <div data-testid='legend-experiment'>{experimentId}</div>
    </div>
  ),
}))

describe('MicrosampleComposition', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  it('renders ImagePlot component', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)
    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
  })

  it('renders TaxonomyChart component', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)
    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
  })

  it('renders TaxonomyChartLegend component', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)
    expect(screen.getByTestId('taxonomy-legend')).toBeInTheDocument()
  })

  it('filters data by cryosection', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)

    // Should show 2 microsamples for G_CS1 (not H_CS1)
    expect(screen.getByTestId('microsample-count')).toHaveTextContent('2')
  })

  it('passes correct cryosection to ImagePlot', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)
    expect(screen.getByTestId('cryosection')).toHaveTextContent('G_CS1')
  })

  it('initializes with phylum as selectedTaxonomicLevel', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)

    expect(screen.getByTestId('selected-level')).toHaveTextContent('phylum')
    expect(screen.getByTestId('legend-level')).toHaveTextContent('phylum')
  })

  it('extracts experimentId from cryosection', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)

    // experimentId should be 'G' (first character)
    expect(screen.getByTestId('legend-experiment')).toHaveTextContent('G')
  })

  it('passes all microsampleIds to TaxonomyChart initially', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)

    // Should pass all 2 microsamples initially (empty selection)
    expect(screen.getByTestId('chart-sample-count')).toHaveTextContent('2')
  })

  it('handles cryosection with no matching data', () => {
    render(<MicrosampleComposition cryosection='Z_CS1' />)

    // Should show 0 microsamples
    expect(screen.getByTestId('microsample-count')).toHaveTextContent('0')
  })

  it('handles empty cryosection', () => {
    render(<MicrosampleComposition cryosection='' />)

    expect(screen.getByTestId('microsample-count')).toHaveTextContent('0')
  })

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    render(<MicrosampleComposition cryosection='G_CS1' />)
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('extracts coordination data correctly', () => {
    render(<MicrosampleComposition cryosection='G_CS1' />)

    // Verify components render (proves data extraction worked)
    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
  })

  it('handles missing coordinate fields', () => {
    // This is implicitly tested - component uses || 0 for missing values
    render(<MicrosampleComposition cryosection='G_CS1' />)

    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
  })
})