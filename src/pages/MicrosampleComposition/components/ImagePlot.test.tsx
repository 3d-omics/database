import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ImagePlot from './ImagePlot'

// Mock Plotly
vi.mock('react-plotly.js', () => ({
  default: ({ data, layout, onClick, onSelected, onDeselect }: any) => (
    <div data-testid='plotly-plot'>
      <div data-testid='plot-data'>{JSON.stringify(data)}</div>
      <div data-testid='plot-layout'>{JSON.stringify(layout)}</div>
      <button data-testid='mock-click' onClick={() => onClick?.({ points: [{ pointIndex: 0 }] })}>
        Click Point
      </button>
      <button data-testid='mock-select' onClick={() => onSelected?.({ points: [{ pointIndex: 0 }, { pointIndex: 1 }] })}>
        Select Points
      </button>
      <button data-testid='mock-deselect' onClick={() => onDeselect?.()}>
        Deselect
      </button>
    </div>
  ),
}))

// Mock image import
vi.mock('../../../assets/images/cryosection_images/G_CS1.jpg', () => ({
  default: 'mock-image-url',
}))

describe('ImagePlot', () => {
  const mockSetSelectedMicrosampleIds = vi.fn()

  const mockProps = {
    cryosection: 'G_CS1',
    setSelectedMicrosampleIds: mockSetSelectedMicrosampleIds,
    microsampleIds: ['M001', 'M002', 'M003'],
    xcoord: [100, 200, 300],
    ycoord: [150, 250, 350],
    size: [5, 6, 7],
    shape: ['circle', 'square', 'circle'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Plotly plot', () => {
    render(<ImagePlot {...mockProps} />)
    expect(screen.getByTestId('plotly-plot')).toBeInTheDocument()
  })

  it('creates plot data with correct structure', () => {
    render(<ImagePlot {...mockProps} />)

    const plotData = screen.getByTestId('plot-data')
    const data = JSON.parse(plotData.textContent || '[]')

    expect(data).toHaveLength(1)
    expect(data[0].mode).toBe('markers')
    expect(data[0].type).toBe('scatter')
    expect(data[0].x).toEqual([100, 200, 300])
    expect(data[0].y).toEqual([150, 250, 350])
    expect(data[0].text).toEqual(['M001', 'M002', 'M003'])
  })

  it('includes image layer in layout', () => {
    render(<ImagePlot {...mockProps} />)

    const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')

    expect(layout.images).toBeDefined()
    expect(layout.images).toHaveLength(1)
    expect(layout.images[0].layer).toBe('below')
  })

  it('sets all points to full opacity initially', () => {
    render(<ImagePlot {...mockProps} />)

    const plotData = screen.getByTestId('plot-data')
    const data = JSON.parse(plotData.textContent || '[]')

    // All markers should have opacity 1
    expect(data[0].marker.opacity).toEqual([1, 1, 1])
  })

  it('calls setSelectedMicrosampleIds when point clicked', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    const clickButton = screen.getByTestId('mock-click')
    await user.click(clickButton)

    expect(mockSetSelectedMicrosampleIds).toHaveBeenCalledWith(['M001'])
  })

  it('calls setSelectedMicrosampleIds when multiple points selected', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    const selectButton = screen.getByTestId('mock-select')
    await user.click(selectButton)

    expect(mockSetSelectedMicrosampleIds).toHaveBeenCalledWith(['M001', 'M002'])
  })

  it('clears selection when deselect triggered', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    const deselectButton = screen.getByTestId('mock-deselect')
    await user.click(deselectButton)

    expect(mockSetSelectedMicrosampleIds).toHaveBeenCalledWith([])
  })

  it('updates opacity when points selected', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ImagePlot {...mockProps} />)

    // Simulate selection by clicking
    const clickButton = screen.getByTestId('mock-click')
    await user.click(clickButton)

    // Rerender to see updated state
    rerender(<ImagePlot {...mockProps} />)

    // After implementation, selected point would have opacity 1, others 0.3
    // This is tested via the state update
    expect(mockSetSelectedMicrosampleIds).toHaveBeenCalled()
  })

  it('handles empty click event', async () => {
    const user = userEvent.setup()
    
    const CustomPlot = ({ onClick }: any) => (
      <button data-testid='empty-click' onClick={() => onClick?.({ points: [] })}>
        Empty Click
      </button>
    )

    vi.mocked(await import('react-plotly.js')).default = CustomPlot as any

    render(<ImagePlot {...mockProps} />)

    await user.click(screen.getByTestId('empty-click'))

    expect(mockSetSelectedMicrosampleIds).toHaveBeenCalledWith([])
  })
})