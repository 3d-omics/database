import React, { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'
import { PlotMouseEvent, Layout, Config, PlotSelectionEvent } from 'plotly.js'

const ImagePlot = ({ cryosection, setSelectedMicrosampleIds, microsampleIds, xcoord, ycoord, size, shape }: {
  cryosection: string,
  setSelectedMicrosampleIds: React.Dispatch<React.SetStateAction<string[]>>
  microsampleIds: string[],
  xcoord: number[],
  ycoord: number[],
  size: number[],
  shape: string[],
}) => {

  const [activeIndices, setActiveIndices] = useState<number[] | null>(null);

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
        size: 8,
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

  const layout: Partial<Layout> = useMemo(() => ({ // if useMemo is not used, the image will reset once the samples are selected on zoom
    margin: { l: 0, r: 0, t: 0, b: 0 },
    showlegend: false,
    dragmode: 'pan', // 'pan' for dragging the image, 'select' for selecting microsamples in the area
    xaxis: {
      range: [0, 1000],
      scaleanchor: 'y',
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      range: [0, 1000],
      showgrid: false,
      zeroline: false,
    },
    images: [{
      source: imageUrl,
      x: 0,
      y: 1000,
      sizing: 'fill',
      sizex: 1000,
      sizey: 1000,
      xref: 'x',
      yref: 'y',
      xanchor: 'left',
      yanchor: 'top',
      layer: 'below',
    }],
  }), [cryosection])

  const config: Partial<Config> = useMemo(() => ({
    scrollZoom: true,
    responsive: true,
    displaylogo: false,
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'toImage',
      'zoom2d',
      'lasso2d',
      'autoScale2d',
      'resetScale2d'
    ],
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


  return (
      <Plot
        data={data}
        layout={layout}
        config={config}
        className='w-full h-full border-2'
        onClick={handleClick}
        onSelected={handleSelect}
        onDeselect={handleDeselect}
      />
  )
}

export default ImagePlot
