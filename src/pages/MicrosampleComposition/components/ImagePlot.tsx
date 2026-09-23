import { useMemo, useState, useCallback, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import Plot from 'react-plotly.js'
import { PlotMouseEvent, Layout, Config, PlotSelectionEvent, PlotRelayoutEvent } from 'plotly.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faUpDownLeftRight,
  faVectorSquare,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faExpand,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import useChartTheme from 'hooks/useChartTheme'

// The photograph is drawn over a square 1000 × 1000 of plot space, and the view is kept
// inside those bounds, so the picture always fills the frame: zooming out stops at the
// whole section rather than leaving it adrift in empty space
const IMAGE_SPAN = 1000
// The closest view takes in a twentieth of the section, about 20× magnification
const MIN_SPAN = 50
const ZOOM_STEP = 1.4
// Ranges that agree to within half a pixel of the section are the same view
const TOLERANCE = 0.5

type AxisRange = [number, number]
interface View { x: AxisRange, y: AxisRange }

const FULL_VIEW: View = { x: [0, IMAGE_SPAN], y: [0, IMAGE_SPAN] }

const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

const spanOf = (range: AxisRange) => Math.abs(range[1] - range[0])

// Holds a width between the whole section and the closest view, and snaps one that has
// drifted to within a pixel of either, so zooming back out lands on the image exactly
const boundSpan = (span: number) => {
  if (span >= IMAGE_SPAN - TOLERANCE) return IMAGE_SPAN
  if (span <= MIN_SPAN + TOLERANCE) return MIN_SPAN
  return span
}

// A window of the given width on one axis, pushed back inside the image where the start
// asked for would hang over an edge
const windowFrom = (start: number, span: number): AxisRange => {
  const held = clamp(start, 0, IMAGE_SPAN - span)
  return [held, held + span]
}

// A window of the given width held over the centre of the old one
const windowOver = (range: AxisRange, span: number): AxisRange =>
  windowFrom((range[0] + range[1]) / 2 - span / 2, span)

// Squares up a view and holds it within the image. Everything that moves the view —
// the buttons, a drag, the wheel, a double click — passes through here or through
// `windowFrom`, so no path can put the section anywhere but filling the frame
const fitView = ({ x, y }: View): View => {
  const span = boundSpan(Math.max(spanOf(x), spanOf(y)))
  return { x: windowOver(x, span), y: windowOver(y, span) }
}

// How far one wheel event turns the view. Lines and pages are counted in pixels, as
// firefox and older browsers report them, and a single flick is capped so a coarse
// mouse wheel cannot jump the whole way in one event
const wheelZoom = (event: WheelEvent, frameHeight: number) => {
  const toPixels = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? frameHeight : 1
  return Math.exp(clamp(event.deltaY * toPixels, -120, 120) / 300)
}

const sameView = (a: View, b: View) => (['x', 'y'] as const).every(axis =>
  Math.abs(a[axis][0] - b[axis][0]) < TOLERANCE && Math.abs(a[axis][1] - b[axis][1]) < TOLERANCE
)

// One tool in the rail. A button given `active` reads as a mode that is either in force
// or not; the rest simply act when pressed
const ToolButton = ({ icon, label, onClick, active, disabled = false }: {
  icon: IconDefinition
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    aria-pressed={active}
    className={`flex h-7 w-7 items-center justify-center rounded transition-colors disabled:opacity-30 ${active ? 'bg-light_burgundy text-white' : 'text-ink enabled:hover:bg-surface_muted'
      }`}
  >
    <FontAwesomeIcon icon={icon} className='text-xs' />
  </button>
)

const ImagePlot = ({ cryosection, setSelectedMicrosampleIds, microsampleIds, xcoord, ycoord, size, shape }: {
  cryosection: string
  setSelectedMicrosampleIds: Dispatch<SetStateAction<string[]>>
  microsampleIds: string[]
  xcoord: number[]
  ycoord: number[]
  size: number[]
  shape: string[]
}) => {
  const chartColors = useChartTheme()

  const [activeIndices, setActiveIndices] = useState<number[] | null>(null);
  const [view, setView] = useState<View>(FULL_VIEW)
  const [dragmode, setDragmode] = useState<'pan' | 'select'>('pan')

  const frameRef = useRef<HTMLDivElement>(null)
  // The wheel listener is attached once, so it reads the view it is turning from a ref
  const viewRef = useRef<View>(view)
  useEffect(() => { viewRef.current = view }, [view])
  // Whether a redraw is already booked for the next frame, kept apart from the frame's
  // own number so the booking holds however soon the frame runs
  const wheelPending = useRef(false)
  const wheelFrame = useRef(0)

  const wholeSection = spanOf(view.x) >= IMAGE_SPAN - TOLERANCE
  const closestView = spanOf(view.x) <= MIN_SPAN + TOLERANCE

  const data: any[] = useMemo(() => { // To keep the opacity of unselected points the same with group select
    const markerOpacity = xcoord.map((_, i) => {
      if (!activeIndices) return 1;
      return activeIndices.includes(i) ? 1 : 0.3;
    });

    return [{
      hovertemplate: '<span style="font-size: 15px"><b>%{text}</b></span><br>' +
        '<span style="font-size: 10px">shape:</span> <b>%{customdata[0]}</b><br>' +
        '<span style="font-size: 10px">size:</span> <b>%{customdata[1]}</b>' +
        '<extra></extra>',
      mode: 'markers',
      type: 'scatter',
      x: xcoord,
      y: ycoord,
      microsampleId: microsampleIds,
      text: microsampleIds,
      customdata: xcoord.map((_, index) => [shape[index], size[index]]),
      marker: {
        size: 5,
        opacity: markerOpacity,
        color: '#741B47',
        line: { width: 0, color: 'transparent' },
      },
      unselected: { // To keep the opacity of unselected points the same with single select
        marker: {
          opacity: 0.3,
        }
      }
    }]
  }, [xcoord, ycoord, microsampleIds, shape, size, activeIndices]);

  const imageUrl = new URL(`../../../assets/images/cryosection_images/${cryosection}.jpg`, import.meta.url).href;

  // The axes carry the view held in state, so rebuilding this layout — on a theme change,
  // or when a selection redraws the points — leaves the reader where they were rather
  // than back at the whole section. The ranges are copied in because plotly writes to
  // the arrays it is handed. Pixel coordinates mean nothing to a reader, so no ticks
  const layout: Partial<Layout> = useMemo(() => ({
    margin: { l: 0, r: 0, t: 0, b: 0 },
    showlegend: false,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: chartColors.text },
    // With the whole section in view there is nothing to pan to, and plotly's drag
    // would slide the picture out of the frame and snap it back on release
    dragmode: dragmode === 'pan' && wholeSection ? false : dragmode,
    xaxis: {
      range: [view.x[0], view.x[1]],
      minallowed: 0,
      maxallowed: IMAGE_SPAN,
      scaleanchor: 'y',
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      ticks: '',
      gridcolor: chartColors.grid,
      zerolinecolor: chartColors.axis,
      linecolor: chartColors.axis,
    },
    yaxis: {
      range: [view.y[0], view.y[1]],
      minallowed: 0,
      maxallowed: IMAGE_SPAN,
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      ticks: '',
      gridcolor: chartColors.grid,
      zerolinecolor: chartColors.axis,
      linecolor: chartColors.axis,
    },
    images: [{
      source: imageUrl,
      x: 0,
      y: IMAGE_SPAN,
      sizing: 'fill',
      sizex: IMAGE_SPAN,
      sizey: IMAGE_SPAN,
      xref: 'x',
      yref: 'y',
      xanchor: 'left',
      yanchor: 'top',
      layer: 'below',
    }],
  }), [imageUrl, chartColors, view, dragmode, wholeSection])

  // Plotly's own mode bar is replaced by the rail on the left, which stands in the open
  // rather than appearing on hover, and its scroll zoom by the wheel handler below
  const config: Partial<Config> = useMemo(() => ({
    scrollZoom: false,
    responsive: true,
    displaylogo: false,
    displayModeBar: false,
  }), [])

  const handleClick = (event: PlotMouseEvent) => {
    if (event?.points?.length > 0) {
      const indices = event.points.map(p => p.pointIndex);
      setActiveIndices(indices);
      setSelectedMicrosampleIds(indices.map(i => microsampleIds[i]));
    } else {
      setActiveIndices(null);
      setSelectedMicrosampleIds([]);
    }
  }

  const handleSelect = (event: PlotSelectionEvent) => {
    if (event && event.points && event.points.length > 0) {
      const indices = event.points.map(p => p.pointIndex);
      setActiveIndices(indices);
      setSelectedMicrosampleIds(indices.map(i => microsampleIds[i]));
    }
  }

  const handleDeselect = () => {
    setActiveIndices(null);
    setSelectedMicrosampleIds([]);
  }

  // A drag, the scroll wheel or a double click all report the view they would like here;
  // it is kept only once squared up and bounded, and a view already on screen is left
  // alone, since setting it again would send plotly round the same loop
  const handleRelayout = useCallback((event: Readonly<PlotRelayoutEvent>) => {
    if (event['xaxis.autorange'] || event['yaxis.autorange']) {
      setView(current => sameView(current, FULL_VIEW) ? current : FULL_VIEW)
      return
    }

    const proposed = [
      event['xaxis.range[0]'], event['xaxis.range[1]'],
      event['yaxis.range[0]'], event['yaxis.range[1]'],
    ]
    if (proposed.some(value => typeof value !== 'number')) return

    const [x0, x1, y0, y1] = proposed as number[]
    const fitted = fitView({ x: [x0, x1], y: [y0, y1] })
    setView(current => sameView(current, fitted) ? current : fitted)
  }, [])

  // Zooms about the middle of the view, never past the whole section or the closest view
  const zoomBy = useCallback((factor: number) => {
    setView(current => {
      const span = boundSpan(spanOf(current.x) * factor)
      return { x: windowOver(current.x, span), y: windowOver(current.y, span) }
    })
  }, [])

  // The wheel is handled here rather than by plotly, whose scroll zoom rescales what is
  // already drawn — the section and its dots together — and only settles the ranges once
  // the wheel stops, which let the picture shrink inside the frame mid-turn and snap back
  // after. Each turn is bounded as it happens and the plot is redrawn, so the dots hold
  // their size. The point of the section under the cursor stays under it
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()

      const { left, top, width, height } = frame.getBoundingClientRect()
      if (!width || !height) return

      const current = viewRef.current
      const span = spanOf(current.x)
      const zoomed = boundSpan(span * wheelZoom(event, height))
      if (zoomed === span) return

      // Where the cursor sits in the frame, and the point of the section beneath it
      const across = clamp((event.clientX - left) / width, 0, 1)
      const down = clamp((event.clientY - top) / height, 0, 1)
      const held = {
        x: current.x[0] + across * span,
        // The image is drawn with the top of the section at the top of the y axis
        y: current.y[1] - down * span,
      }

      // Kept on the ref as well as in state, so several wheel events in one frame
      // compound rather than each starting from the view the last render drew
      viewRef.current = {
        x: windowFrom(held.x - across * zoomed, zoomed),
        y: windowFrom(held.y - (1 - down) * zoomed, zoomed),
      }

      // One redraw a frame: a trackpad reports far more wheel events than that
      if (wheelPending.current) return
      wheelPending.current = true
      wheelFrame.current = requestAnimationFrame(() => {
        wheelPending.current = false
        setView(viewRef.current)
      })
    }

    // Not passive: the page must not scroll while the section is being zoomed
    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      frame.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(wheelFrame.current)
    }
  }, [])

  return (
    <div ref={frameRef} className='relative w-full h-full overflow-hidden rounded border border-line bg-surface'>
      <Plot
        data={data}
        layout={layout}
        config={config}
        className='w-full h-full'
        onClick={handleClick}
        onSelected={handleSelect}
        onDeselect={handleDeselect}
        onRelayout={handleRelayout}
      />

      {/* The tools stand down the left edge, clear of the hover label, which plotly
          draws towards the right. Zooming out and fitting go dim once the whole
          section is in view, so the frame's limit is plain before it is met */}
      <div
        aria-label='Image tools'
        className='absolute left-2 top-2 flex flex-col gap-0.5 rounded-md border border-line bg-surface/90 p-1'
      >
        <ToolButton
          icon={faUpDownLeftRight}
          label='Drag to move the image'
          active={dragmode === 'pan'}
          onClick={() => setDragmode('pan')}
        />
        <ToolButton
          icon={faVectorSquare}
          label='Drag to select microsamples'
          active={dragmode === 'select'}
          onClick={() => setDragmode('select')}
        />

        <span className='my-0.5 h-px bg-line' />

        <ToolButton
          icon={faMagnifyingGlassPlus}
          label='Zoom in'
          disabled={closestView}
          onClick={() => zoomBy(1 / ZOOM_STEP)}
        />
        <ToolButton
          icon={faMagnifyingGlassMinus}
          label='Zoom out'
          disabled={wholeSection}
          onClick={() => zoomBy(ZOOM_STEP)}
        />
        <ToolButton
          icon={faExpand}
          label='Fit the whole section'
          disabled={wholeSection}
          onClick={() => setView(FULL_VIEW)}
        />

        {activeIndices && (
          <>
            <span className='my-0.5 h-px bg-line' />
            <ToolButton icon={faXmark} label='Clear the selection' onClick={handleDeselect} />
          </>
        )}
      </div>
    </div>
  )
}

export default ImagePlot
