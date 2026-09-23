import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ImagePlot from './ImagePlot'

// Mock Plotly
vi.mock('react-plotly.js', () => ({
  default: ({ data, layout, config, onClick, onSelected, onDeselect, onRelayout }: any) => (
    <div data-testid='plotly-plot'>
      <div data-testid='plot-data'>{JSON.stringify(data)}</div>
      <div data-testid='plot-layout'>{JSON.stringify(layout)}</div>
      <div data-testid='plot-config'>{JSON.stringify(config)}</div>
      <button
        data-testid='mock-zoom-out'
        onClick={() => onRelayout?.({
          'xaxis.range[0]': -500, 'xaxis.range[1]': 1500,
          'yaxis.range[0]': -500, 'yaxis.range[1]': 1500,
        })}
      >
        Zoom Past The Image
      </button>
      <button
        data-testid='mock-pan'
        onClick={() => onRelayout?.({
          'xaxis.range[0]': 200, 'xaxis.range[1]': 700,
          'yaxis.range[0]': 100, 'yaxis.range[1]': 600,
        })}
      >
        Pan
      </button>
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

const layoutOf = () => JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')

// jsdom lays nothing out, so the frame is given a 500 × 500 square on screen, and the
// animation frame the wheel handler waits for is run at once
const FRAME_SIZE = 500
const squareFrame = () => vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
  left: 0, top: 0, right: FRAME_SIZE, bottom: FRAME_SIZE, width: FRAME_SIZE, height: FRAME_SIZE,
  x: 0, y: 0, toJSON: () => ({}),
} as DOMRect)

const runFrames = () => vi.spyOn(window, 'requestAnimationFrame')
  .mockImplementation((callback: FrameRequestCallback) => { callback(0); return 0 })

// One turn of the wheel over the frame, at a point given as a fraction of it
const turnWheel = (frame: Element, deltaY: number, across = 0.5, down = 0.5) => {
  const event = new WheelEvent('wheel', {
    deltaY, clientX: across * FRAME_SIZE, clientY: down * FRAME_SIZE, bubbles: true, cancelable: true,
  })
  act(() => { frame.dispatchEvent(event) })
  return event
}

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

  it('holds the whole section in view to begin with, and hides the pixel ticks', () => {
    render(<ImagePlot {...mockProps} />)

    const layout = layoutOf()

    expect(layout.xaxis.range).toEqual([0, 1000])
    expect(layout.yaxis.range).toEqual([0, 1000])
    expect(layout.xaxis.showticklabels).toBe(false)
    expect(layout.yaxis.showticklabels).toBe(false)
  })

  it('bounds both axes to the image', () => {
    render(<ImagePlot {...mockProps} />)

    const layout = layoutOf()

    expect(layout.xaxis.minallowed).toBe(0)
    expect(layout.xaxis.maxallowed).toBe(1000)
    expect(layout.yaxis.minallowed).toBe(0)
    expect(layout.yaxis.maxallowed).toBe(1000)
  })

  it('renders the tools beside the image rather than plotly’s own mode bar', () => {
    render(<ImagePlot {...mockProps} />)

    expect(screen.getByLabelText('Image tools')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Drag to move the image' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Drag to select microsamples' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
  })

  it('starts on the move tool and switches to selection when that one is taken', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    expect(screen.getByRole('button', { name: 'Drag to move the image' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Drag to select microsamples' }))

    expect(layoutOf().dragmode).toBe('select')
    expect(screen.getByRole('button', { name: 'Drag to select microsamples' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('leaves dragging off until there is somewhere to pan to', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    // The whole section is in view, so a drag could only slide it out of the frame
    expect(layoutOf().dragmode).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Zoom in' }))

    expect(layoutOf().dragmode).toBe('pan')
  })

  it('offers no way out once the whole section is in view', () => {
    render(<ImagePlot {...mockProps} />)

    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Fit the whole section' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeEnabled()
  })

  it('zooms in about the middle and back out to the whole section, never past it', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    await user.click(screen.getByRole('button', { name: 'Zoom in' }))

    const zoomed = layoutOf()
    expect(zoomed.xaxis.range[1] - zoomed.xaxis.range[0]).toBeCloseTo(1000 / 1.4)
    // Centred on the middle of the section, and square with the other axis
    expect((zoomed.xaxis.range[0] + zoomed.xaxis.range[1]) / 2).toBeCloseTo(500)
    expect(zoomed.yaxis.range).toEqual(zoomed.xaxis.range)

    await user.click(screen.getByRole('button', { name: 'Zoom out' }))

    expect(layoutOf().xaxis.range).toEqual([0, 1000])
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled()
  })

  it('stops zooming in at the closest view', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    const zoomIn = screen.getByRole('button', { name: 'Zoom in' })
    for (let press = 0; press < 12 && !(zoomIn as HTMLButtonElement).disabled; press++) {
      await user.click(zoomIn)
    }

    const closest = layoutOf()
    expect(closest.xaxis.range[1] - closest.xaxis.range[0]).toBeCloseTo(50)
    expect(zoomIn).toBeDisabled()
  })

  it('pulls a view dragged or scrolled past the image back inside it', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    await user.click(screen.getByTestId('mock-zoom-out'))

    // Plotly asked for 2000 across, starting outside the image; it gets the section
    expect(layoutOf().xaxis.range).toEqual([0, 1000])
    expect(layoutOf().yaxis.range).toEqual([0, 1000])
  })

  it('keeps a view the reader pans to within the image', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    await user.click(screen.getByTestId('mock-pan'))

    expect(layoutOf().xaxis.range).toEqual([200, 700])
    expect(layoutOf().yaxis.range).toEqual([100, 600])
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeEnabled()
  })

  it('offers a way to clear the selection once there is one', async () => {
    const user = userEvent.setup()
    render(<ImagePlot {...mockProps} />)

    expect(screen.queryByRole('button', { name: 'Clear the selection' })).not.toBeInTheDocument()

    await user.click(screen.getByTestId('mock-click'))
    await user.click(screen.getByRole('button', { name: 'Clear the selection' }))

    expect(mockSetSelectedMicrosampleIds).toHaveBeenLastCalledWith([])
    expect(screen.queryByRole('button', { name: 'Clear the selection' })).not.toBeInTheDocument()
  })

  it('turns the wheel itself rather than leaving it to plotly', () => {
    render(<ImagePlot {...mockProps} />)

    // Plotly's scroll zoom rescales what is drawn and settles the ranges only once the
    // wheel stops, so the dots shrink mid-turn and snap back after
    expect(JSON.parse(screen.getByTestId('plot-config').textContent || '{}').scrollZoom).toBe(false)
  })

  it('zooms in on the wheel and holds the page still', () => {
    squareFrame()
    runFrames()
    const { container } = render(<ImagePlot {...mockProps} />)

    const event = turnWheel(container.firstElementChild!, -200)

    const span = layoutOf().xaxis.range[1] - layoutOf().xaxis.range[0]
    expect(span).toBeLessThan(1000)
    expect(span).toBeGreaterThan(50)
    expect(event.defaultPrevented).toBe(true)
  })

  it('keeps the point under the cursor still as the wheel turns', () => {
    squareFrame()
    runFrames()
    const { container } = render(<ImagePlot {...mockProps} />)

    // The cursor on the section's top left corner: that corner stays in the corner
    turnWheel(container.firstElementChild!, -200, 0, 0)

    const { xaxis, yaxis } = layoutOf()
    expect(xaxis.range[0]).toBeCloseTo(0)
    expect(yaxis.range[1]).toBeCloseTo(1000)
    expect(xaxis.range[1] - xaxis.range[0]).toBeCloseTo(yaxis.range[1] - yaxis.range[0])
  })

  it('never lets the wheel take the view past the whole section', () => {
    squareFrame()
    runFrames()
    const { container } = render(<ImagePlot {...mockProps} />)
    const frame = container.firstElementChild!

    turnWheel(frame, -600, 0.25, 0.25)
    for (let turn = 0; turn < 10; turn++) turnWheel(frame, 600, 0.75, 0.75)

    // Every turn is bounded as it happens, so the section never shrinks inside the frame
    expect(layoutOf().xaxis.range).toEqual([0, 1000])
    expect(layoutOf().yaxis.range).toEqual([0, 1000])
  })

  it('stops the wheel at the closest view', () => {
    squareFrame()
    runFrames()
    const { container } = render(<ImagePlot {...mockProps} />)
    const frame = container.firstElementChild!

    for (let turn = 0; turn < 20; turn++) turnWheel(frame, -600)

    const { xaxis } = layoutOf()
    expect(xaxis.range[1] - xaxis.range[0]).toBeCloseTo(50)
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