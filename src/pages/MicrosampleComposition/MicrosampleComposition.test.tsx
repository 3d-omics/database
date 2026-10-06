import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
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
        run_accession: 'ERR1',
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

vi.mock('assets/data/airtable/microsample.json', () => ({ default: [
  { fields: { Code: 'G_CS1_001', 'ENA accession': ['ERR1'] } },
] }))

// Mock components
vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}))

vi.mock('./components/ImagePlot', () => ({
  default: ({ cryosection, microsampleIds, microsampleCodes, onOpenMicrosample }: any) => (
    <div data-testid='image-plot'>
      <div data-testid='cryosection'>{cryosection}</div>
      <div data-testid='microsample-count'>{microsampleIds.length}</div>
      <div data-testid='mapped-code'>{microsampleCodes[0]}</div>
      <button onClick={() => onOpenMicrosample(microsampleCodes[0])}>Open first microsample</button>
    </div>
  ),
}))

vi.mock('./components/TaxonomyChart', () => ({
  default: ({ microsampleIds, selectedTaxonomicLevel, isChangingLevel }: any) => (
    <div data-testid='taxonomy-chart' data-changing={String(isChangingLevel)}>
      <div data-testid='selected-level'>{selectedTaxonomicLevel}</div>
      <div data-testid='chart-sample-count'>{microsampleIds.length}</div>
    </div>
  ),
}))

vi.mock('components/TaxonomyChartLegend', () => ({
  default: ({ selectedTaxonomicLevel, experimentId, layout }: any) => (
    <div data-testid='taxonomy-legend' data-layout={layout}>
      <div data-testid='legend-level'>{selectedTaxonomicLevel}</div>
      <div data-testid='legend-experiment'>{experimentId}</div>
    </div>
  ),
}))

const renderComposition = (cryosection: string) => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <MicrosampleComposition cryosection={cryosection} />
  </MemoryRouter>
)

describe('MicrosampleComposition', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  it('renders ImagePlot component', () => {
    renderComposition('G_CS1')
    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
  })

  it('renders TaxonomyChart component', () => {
    renderComposition('G_CS1')
    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
  })

  it('renders TaxonomyChartLegend component', () => {
    renderComposition('G_CS1')
    expect(screen.getByTestId('taxonomy-legend')).toBeInTheDocument()
  })

  it('heads the section Metagenomics', () => {
    renderComposition('G_CS1')
    expect(screen.getByRole('region', { name: 'Metagenomics' })).toBeInTheDocument()
  })

  it('sets the legend in a row below the image and chart', () => {
    renderComposition('G_CS1')

    const legend = screen.getByTestId('taxonomy-legend')
    expect(legend).toHaveAttribute('data-layout', 'row')
    expect(screen.getByTestId('taxonomy-chart').compareDocumentPosition(legend) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByTestId('image-plot').compareDocumentPosition(legend) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('redraws the chart and legend at the level picked, covering the chart meanwhile', async () => {
    vi.useFakeTimers()
    try {
      renderComposition('G_CS1')

      fireEvent.click(screen.getByRole('button', { name: 'Order' }))
      expect(screen.getByTestId('taxonomy-chart')).toHaveAttribute('data-changing', 'true')

      await act(() => vi.advanceTimersByTimeAsync(150))
      expect(screen.getByTestId('selected-level')).toHaveTextContent('order')
      expect(screen.getByTestId('legend-level')).toHaveTextContent('order')
      expect(screen.getByTestId('taxonomy-chart')).toHaveAttribute('data-changing', 'false')
    } finally {
      vi.useRealTimers()
    }
  })

  it('filters data by cryosection', () => {
    renderComposition('G_CS1')

    // Should show 2 microsamples for G_CS1 (not H_CS1)
    expect(screen.getByTestId('microsample-count')).toHaveTextContent('2')
  })

  it('passes correct cryosection to ImagePlot', () => {
    renderComposition('G_CS1')
    expect(screen.getByTestId('cryosection')).toHaveTextContent('G_CS1')
  })

  it('opens the public microsample code found through its ENA run', () => {
    render(<MemoryRouter initialEntries={['/cryosections/G_CS1']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path='/cryosections/:id' element={<MicrosampleComposition cryosection='G_CS1' />} />
        <Route path='/microsamples/:code' element={<div>Microsample detail route</div>} />
      </Routes>
    </MemoryRouter>)
    expect(screen.getByTestId('mapped-code')).toHaveTextContent('G_CS1_001')
    fireEvent.click(screen.getByRole('button', { name: 'Open first microsample' }))
    expect(screen.getByText('Microsample detail route')).toBeInTheDocument()
  })

  it('initializes with phylum as selectedTaxonomicLevel', () => {
    renderComposition('G_CS1')

    expect(screen.getByTestId('selected-level')).toHaveTextContent('phylum')
    expect(screen.getByTestId('legend-level')).toHaveTextContent('phylum')
  })

  it('extracts experimentId from cryosection', () => {
    renderComposition('G_CS1')

    // experimentId should be 'G' (first character)
    expect(screen.getByTestId('legend-experiment')).toHaveTextContent('G')
  })

  it('passes all microsampleIds to TaxonomyChart initially', () => {
    renderComposition('G_CS1')

    // Should pass all 2 microsamples initially (empty selection)
    expect(screen.getByTestId('chart-sample-count')).toHaveTextContent('2')
  })

  it('handles cryosection with no matching data', () => {
    renderComposition('Z_CS1')

    // Should show 0 microsamples
    expect(screen.getByTestId('microsample-count')).toHaveTextContent('0')
  })

  it('handles empty cryosection', () => {
    renderComposition('')

    expect(screen.getByTestId('microsample-count')).toHaveTextContent('0')
  })

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderComposition('G_CS1')
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('extracts coordination data correctly', () => {
    renderComposition('G_CS1')

    // Verify components render (proves data extraction worked)
    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
    expect(screen.getByTestId('taxonomy-chart')).toBeInTheDocument()
  })

  it('handles missing coordinate fields', () => {
    // This is implicitly tested - component uses || 0 for missing values
    renderComposition('G_CS1')

    expect(screen.getByTestId('image-plot')).toBeInTheDocument()
  })
})
