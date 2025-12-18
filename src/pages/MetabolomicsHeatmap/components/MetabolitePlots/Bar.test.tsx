import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Barplot from './Bar'
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

describe('Barplot', () => {

  const originalError = console.error

  beforeEach(() => {
    vi.clearAllMocks()

    // Suppress act warnings - internal state updates are expected
    console.error = (...args: any[]) => {
      if (args[0]?.includes?.('act(') || args[0]?.includes?.('Warning: An update')) return
      originalError(...args)
    }


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
    console.error = originalError
    vi.restoreAllMocks()
  })

  it('shows loading skeleton when data not ready', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {},
      listOfCuratedIdsOfMetabolites: [],
    })

    render(<Barplot id={['S001']} experimentId='G' />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('plot-container')).not.toBeInTheDocument()
  })

  it('renders plot when data is ready', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {
        S001: [10, 20, 30, 15, 25],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003', 'M004', 'M005'],
    })

    render(<Barplot id={['S001']} experimentId='G' />)

    expect(screen.getByTestId('plot-container')).toBeInTheDocument()
    expect(screen.getByTestId('plotly-plot')).toBeInTheDocument()
  })

  it('sorts data by value in descending order', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {
        S001: [10, 30, 20],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003'],
    })

    render(<Barplot id={['S001']} experimentId='G' />)

    const plotData = screen.getByTestId('plot-data')
    const data = JSON.parse(plotData.textContent || '[]')

    // Values should be sorted: [30, 20, 10]
    expect(data[0].y).toEqual([30, 20, 10])

    // IDs should be sorted by their values: M002 (30), M003 (20), M001 (10)
    expect(data[0].x).toEqual(['M002', 'M003', 'M001'])
  })

  it('handles empty data', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {},
      listOfCuratedIdsOfMetabolites: [],
    })

    render(<Barplot id={['S001']} experimentId='G' />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('handles missing sample data', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {
        S002: [10, 20, 30],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003'],
    })

    // Requesting S001 but only S002 exists
    render(<Barplot id={['S001']} experimentId='G' />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('calculates plot width based on metabolite count', () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {
        S001: [10, 20, 30],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003'],
    })

    render(<Barplot id={['S001']} experimentId='G' />)

    const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')

    // 3 metabolites * 9 = 27, which is less than window width (1024)
    // So width should be window width
    expect(layout.width).toBe(1024)
  })

  it('handles window resize', async () => {
    (useMetaboliteExcelFileData as any).mockReturnValue({
      originalColumnData: {
        S001: [10, 20, 30],
      },
      listOfCuratedIdsOfMetabolites: ['M001', 'M002', 'M003'],
    })

    render(<Barplot id={['S001']} experimentId='G' />)

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 1280 })
    Object.defineProperty(window, 'innerHeight', { value: 800 })

    window.dispatchEvent(new Event('resize'))

    await waitFor(() => {
      const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')
      expect(layout.width).toBe(1280)
    })

    const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')
    expect(layout.height).toBe(700) // 800 - 100
  })
})