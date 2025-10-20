import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Composition from '../Composition/index'

// Mock child components
vi.mock('./components/ImagePlot', () => ({
  default: (props: any) => {
    // Remove non-DOM props
    const {
      microsampleIds,
      setSelectedMicrosampleIds,
      selectedTaxonomicLevel,
      setSelectedTaxonomicLevel,
      ...rest
    } = props || {};
    return <div data-testid="image-plot" {...rest} />;
  },
}))
vi.mock('./components/Legend', () => ({
  default: (props: any) => {
    const {
      microsampleIds,
      setSelectedMicrosampleIds,
      selectedTaxonomicLevel,
      setSelectedTaxonomicLevel,
      ...rest
    } = props || {};
    return <div data-testid="legend" {...rest} />;
  },
}))
vi.mock('./components/TaxonomyGraph', () => ({
  default: (props: any) => {
    const {
      microsampleIds,
      setSelectedMicrosampleIds,
      selectedTaxonomicLevel,
      setSelectedTaxonomicLevel,
      ...rest
    } = props || {};
    return <div data-testid="taxonomy-graph" {...rest} />;
  },
}))
vi.mock('./components/Guide', () => ({
  default: () => <div data-testid="guide" />
}))
vi.mock('components/ErrorBanner', () => ({
  default: (props: any) => <div data-testid="error-banner">{props.children}</div>
}))

// Mock data file
vi.mock('assets/G121eI104C.csv', () => ({
  __esModule: true,
  default: {},
}))

// Mock useFetchExcelFileData hook
const mockFetchExcel = vi.fn()
vi.mock('hooks/useFetchExcelFileData', () => ({
  default: vi.fn(() => ({
    fetchExcel: mockFetchExcel,
    fetchExcelError: null,
  })),
}))

describe('Composition page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state and then main components after data loads', async () => {
    mockFetchExcel.mockResolvedValueOnce({
      Ycoord_pixel_crop: [1, 2],
      Xcoord_pixel_crop: [3, 4],
      size: [10, 20],
      shape: ['circle', 'square'],
      ID: ['id1', 'id2'],
    })

    render(<Composition />)

    expect(screen.getByTestId('guide')).toBeInTheDocument()
    expect(screen.getByText(/Cryosection:/)).toBeInTheDocument()
    expect(screen.getByText('G121eI104C')).toBeInTheDocument()

    expect(await screen.findByTestId('image-plot')).toBeInTheDocument()
    expect(await screen.findByTestId('taxonomy-graph')).toBeInTheDocument()
    expect(await screen.findByTestId('legend')).toBeInTheDocument()
  })
  

  // it('renders ErrorBanner if fetchExcelError is present', () => {
  //   // Override the mock to return an error
  //   (require('hooks/useFetchExcelFileData').default as any).mockReturnValueOnce({
  //     fetchExcel: vi.fn(),
  //     fetchExcelError: 'Failed to load data',
  //   })

  //   render(<Composition />)
  //   expect(screen.getByTestId('error-banner')).toHaveTextContent('Failed to load data')
  // })



  // it('passes correct props to ImagePlot', async () => {
  //   const mockData = {
  //     Ycoord_pixel_crop: [5],
  //     Xcoord_pixel_crop: [6],
  //     size: [15],
  //     shape: ['triangle'],
  //     ID: ['id3'],
  //   }
  //   mockFetchExcel.mockResolvedValueOnce(mockData)

  //   render(<Composition />)

  //   await waitFor(() => {
  //     const imagePlot = screen.getByTestId('image-plot')
  //     expect(imagePlot).toHaveAttribute('cryosection', 'G121eI104C')
  //     expect(imagePlot).toHaveProperty('props.microsampleIds', mockData.ID)
  //     expect(imagePlot).toHaveProperty('props.xcoord', mockData.Xcoord_pixel_crop)
  //     expect(imagePlot).toHaveProperty('props.ycoord', mockData.Ycoord_pixel_crop)
  //     expect(imagePlot).toHaveProperty('props.size', mockData.size)
  //     expect(imagePlot).toHaveProperty('props.shape', mockData.shape)
  //   })
  // })

})