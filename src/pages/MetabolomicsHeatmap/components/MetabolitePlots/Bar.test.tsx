import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SingleMetaboliteBarPlot from './Bar'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'
import Plot from 'react-plotly.js'


// Mock Plotly so we can test props easily
vi.mock('react-plotly.js', async () => {
  const React = await import('react')
  return {
    __esModule: true,
    default: vi.fn((props) => <div data-testid="mock-plot" {...props} />)
  }
})

// Mock hook
vi.mock('hooks/useMetaboliteExcelFileData', () => ({
  __esModule: true,
  default: vi.fn(),
}))


const returnValueMock = {
  originalColumnData: {
    Feature_ID: ["HILIC_pos_137_07117a2_34", "HILIC_pos_130_08627a4_931", "HILIC_pos_284_09863a4_18", "RP_neg_173_08228a4_732"],
    I001dH: [122, 252, 10, 187].map(String),
    I001dI: [474, 272, 125, 95].map(String),
    I002dH: [72, 1037, 12, 205].map(String),
    curatedId: ['1-Methylnicotinamide', 'Pipecolic acid', 'Guanosine', 'Suberic acid']
  },
  listOfCuratedIdsOfMetabolites: ['1-Methylnicotinamide', 'Pipecolic acid', 'Guanosine', 'Suberic acid'],
  listOfSampleIdsThatHaveMetaboliteData: ['I001dH', 'I001dI', 'I002dH'],
  normalizedColumnData: {
    Feature_ID: ["HILIC_pos_137_07117a2_34", "HILIC_pos_130_08627a4_931", "HILIC_pos_284_09863a4_18", "RP_neg_173_08228a4_732"],
    I001dH: [-0.33, -0.5, -0.58, -0.89].map(String),
    I001dI: [-0.27, -0.58, 0.03, -0.66].map(String),
    I002dH: [-0.88, 1.65, -0.41, -0.34].map(String),
    curatedId: ['1-Methylnicotinamide', 'Pipecolic acid', 'Guanosine', 'Suberic acid']
  },
  fetchMetaboliteError: null
}




describe('components > MetabolitePlots > BarPlot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading skeleton when data is not ready', () => {
    vi.mocked(useMetaboliteExcelFileData).mockReturnValue({
      originalColumnData: {},
      listOfCuratedIdsOfMetabolites: [],
      listOfSampleIdsThatHaveMetaboliteData: [],
      normalizedColumnData: {},
      fetchMetaboliteError: null
    })
    render(<SingleMetaboliteBarPlot id={['sample1']} />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('plot-container')).not.toBeInTheDocument()
  })


  it('should render bar plot when data is ready and valid', () => {
    vi.mocked(useMetaboliteExcelFileData).mockReturnValue(returnValueMock)
    render(<SingleMetaboliteBarPlot id={['I001dH']} />)
    expect(screen.getByTestId('plot-container')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument()
  })


  it('should sort data correctly with valid numerical values', () => {
    vi.mocked(useMetaboliteExcelFileData).mockReturnValue(returnValueMock)
    render(<SingleMetaboliteBarPlot id={['I001dH']} />)
    const plotElement = screen.getByTestId('plot-container')
    expect(plotElement).toBeInTheDocument()
    const plotProps = (Plot as jest.Mock).mock.calls[0][0]
    expect(plotProps.data[0].x).toEqual(['Pipecolic acid', 'Suberic acid', '1-Methylnicotinamide', 'Guanosine'])
    expect(plotProps.data[0].y).toEqual([252, 187, 122, 10])
  })


  it('should handle empty id array gracefully', () => {
    vi.mocked(useMetaboliteExcelFileData).mockReturnValue(returnValueMock)
    render(<SingleMetaboliteBarPlot id={['']} />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('plot-container')).not.toBeInTheDocument()
  })


  it('should handle missing or undefined originalColumnData values', () => {
    vi.mocked(useMetaboliteExcelFileData).mockReturnValue({
      ...returnValueMock,
      originalColumnData: {}
    })
    render(<SingleMetaboliteBarPlot id={['I001dH']} />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('plot-container')).not.toBeInTheDocument()
  })

})
