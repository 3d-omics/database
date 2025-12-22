import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Heatmap from './Heatmap'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'

// Mock the hook
vi.mock('hooks/useMetaboliteExcelFileData')

// Mock Plotly
vi.mock('react-plotly.js', () => ({
  default: ({ data, layout }: any) => (
    <div data-testid='plotly-plot'>
      <div data-testid='plot-data'>{JSON.stringify(data)}</div>
      <div data-testid='plot-layout'>{JSON.stringify(layout)}</div>
    </div>
  ),
}))

// Suppress console.log and act warnings
const originalLog = console.log
const originalError = console.error

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('act(')) return
    originalError(...args)
  }
})

afterAll(() => {
  console.log = originalLog
  console.error = originalError
})

describe('Heatmap', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading skeleton when data not ready', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {},
      listOfCuratedIdsOfMetabolites: [],
      listOfSampleIdsThatHaveMetaboliteData: [],
    })

    render(<Heatmap ids={['S001', 'S002']} experimentId='G' />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('plot-container')).not.toBeInTheDocument()
  })

  it('renders plot when data is ready', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {
        S001: [0.5, 1.2, -0.3],
        S002: [0.8, -0.5, 1.1],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003'],
      listOfSampleIdsThatHaveMetaboliteData: ['S001', 'S002'],
    })

    render(<Heatmap ids={['S001', 'S002']} experimentId='G' />)

    expect(screen.getByTestId('plot-container')).toBeInTheDocument()
    expect(screen.getByTestId('plotly-plot')).toBeInTheDocument()
  })

  it('transforms data into correct heatmap format', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {
        S001: [0.5, 1.2],
        S002: [0.8, -0.5],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002'],
      listOfSampleIdsThatHaveMetaboliteData: ['S001', 'S002'],
    })

    render(<Heatmap ids={['S001', 'S002']} experimentId='G' />)

    const plotData = screen.getByTestId('plot-data')
    const data = JSON.parse(plotData.textContent || '[]')

    expect(data[0].type).toBe('heatmap')
    expect(data[0].x).toEqual(['S001', 'S002']) // Sample IDs
    expect(data[0].y).toEqual(['M001', 'M002']) // Metabolite IDs
    expect(data[0].z).toEqual([
      [0.5, 0.8],    // M001 values for [S001, S002]
      [1.2, -0.5],   // M002 values for [S001, S002]
    ])
  })

  it('handles empty data', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {},
      listOfCuratedIdsOfMetabolites: [],
      listOfSampleIdsThatHaveMetaboliteData: [],
    })

    render(<Heatmap ids={['S001']} experimentId='G' />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('handles missing sample data', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {
        S002: [0.5, 1.2],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002'],
      listOfSampleIdsThatHaveMetaboliteData: ['S002'],
    })

    // Requesting S001 but only S002 exists
    render(<Heatmap ids={['S001']} experimentId='G' />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('calculates plot dimensions based on data', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {
        S001: [0.5, 1.2, -0.3],
        S002: [0.8, -0.5, 1.1],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003'],
      listOfSampleIdsThatHaveMetaboliteData: ['S001', 'S002'],
    })

    render(<Heatmap ids={['S001', 'S002']} experimentId='G' />)

    const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')

    // Width: 2 samples * 9 = 18, less than window width, so width = windowWidth
    expect(layout.width).toBe(1024)

    // Height: 3 metabolites * 8 = 24
    expect(layout.height).toBe(24)
  })

  it('handles window resize', async () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      normalizedColumnData: {
        S001: [0.5, 1.2],
        S002: [0.8, -0.5],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002'],
      listOfSampleIdsThatHaveMetaboliteData: ['S001', 'S002'],
    })

    render(<Heatmap ids={['S001', 'S002']} experimentId='G' />)

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 1280 })
    Object.defineProperty(window, 'innerHeight', { value: 800 })

    window.dispatchEvent(new Event('resize'))

    await waitFor(() => {
      const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')
      expect(layout.width).toBe(1280)
    })
  })
})