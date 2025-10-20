import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { Layout, Config } from 'plotly.js'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'

const MetaboliteHeatmapComparison = ({ ids }: { ids: string[] }) => {

  const { normalizedColumnData, listOfCuratedIdsOfMetabolites } = useMetaboliteExcelFileData()

  // Check if data is ready, if not, show a loading state
  const isDataReady = useMemo(() => {
    return (
      listOfCuratedIdsOfMetabolites.length > 0 &&
      ids.every((id) => Array.isArray(normalizedColumnData[id]))
    )
  }, [normalizedColumnData, listOfCuratedIdsOfMetabolites, ids])

  // const isDataReady = false

  const extractedXData = ids
  const extractedYData = listOfCuratedIdsOfMetabolites
  const extractedZData = ids.map((id) => normalizedColumnData[id] ? normalizedColumnData[id].slice(0, 152).map(Number) : []) // 152 is the row that has curated ID
  const clippedExtractedZData = extractedZData.map(row => row.map(value => Math.max(-2, Math.min(2, value))));

  const data: any[] = [{
    type: 'heatmap',
    hovertemplate: '<span style="font-size: 10px">Metabolite Curated ID:</span> <b>%{x}</b><br>' +
      '<span style="font-size: 10px">Sample ID:</span> <b>%{y}</b><br>' +
      '<span style="font-size: 10px">Normalized Abundance:</span> <b>%{z}</b>' +
      '<extra></extra>',
    y: extractedXData,
    x: extractedYData,
    z: clippedExtractedZData,
    // colorscale: "Viridis",
    zmin: -2.5,
    zmax: 2.5,
    colorbar: { // 表の横にある目盛
      outlinewidth: 0,
      thickness: 24, // Width of the colorbar
      title: {
        text: "Normalized Abundance", // Optional title for the colorbar
        side: "", // Position of the title
        font: { size: 10 }, // Font size for the title
      },
      tickfont: { size: 9 }, // Font size for the tick labels
      tickmode: "array",
      tickvals: [-2.5, -2, -1, 0, 1, 2, 2.5], // Extra space beyond -2 and 2
      ticktext: [" ", "-2", "-1", "0", "1", "2", " "], // Blank spaces for clipped values
    },
  }]

  const layout: Partial<Layout> = {
    title: { text: '' },
    showlegend: false,
    autosize: true,
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'bottom',
      automargin: true,
      dtick: 1,
      tickfont: { size: 8 },
      tickangle: 55,
    },
    yaxis: {
      automargin: true, // to make all the Y label appear 
      ticks: '',
      dtick: 1, // Display every nth label
      ticksuffix: '',
      tickfont: { size: 10 },
    },
    margin: {
      // l: 200, // Left margin for long y-axis labels
      // r: 50, // Right margin
      t: 20, // Top margin
      b: 20, // Bottom margin
    },
    width: 1300,
  }

  const config: Partial<Config> = {
    displaylogo: false,
    displayModeBar: false,
    modeBarButtonsToRemove: ['toImage', 'lasso2d', 'pan2d', 'zoom2d', 'select2d'],
  }

  return (
    <>
      {!isDataReady
        ?
        <div className='animate-pulse h-[450px] w-[1300px] flex flex-col justify-center' data-testid='loading-skeleton'>
          <div className='flex justify-center items-center gap-1'>
            <div className='flex flex-col justify-evenly h-full'>
              <div className='bg-gray-200 w-12 h-4 rounded'></div>
              <div className='bg-gray-200 w-12 h-4 rounded'></div>
            </div>
            <div className='h-[240px] w-[1052px] bg-gray-200 rounded mr-7'></div>
            <div className='h-[190px] w-6 bg-gray-200 rounded mr-16'></div>
          </div>
          <div className='ml-[124px] h-[170px] w-[1052px] flex gap-1 [&>div]:-rotate-[35deg]'>
            {Array.from({ length: 152 }).map((_, index) => (
              <div key={index} className='h-28 w-1 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
        :
        <div data-testid="plot-container">
          <Plot data={data} layout={layout} config={config} />
        </div>
      }
    </>
  )
}

export default MetaboliteHeatmapComparison