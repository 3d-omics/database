import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Layout, Config } from 'plotly.js'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'

const Heatmap = ({ ids, experimentId }: {
  ids: string[],
  experimentId: string
}) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  console.log(windowWidth)

  const { normalizedColumnData, listOfCuratedIdsOfMetabolites, listOfSampleIdsThatHaveMetaboliteData } = useMetaboliteExcelFileData({ experimentId })

  const plotWidth = listOfSampleIdsThatHaveMetaboliteData?.length * 9 < windowWidth
    ? windowWidth
    : listOfSampleIdsThatHaveMetaboliteData?.length * 9 || 0
  const plotHeight = listOfCuratedIdsOfMetabolites?.length * 8

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Check if data is ready, if not, show a loading state
  const isDataReady = useMemo(() => {
    return (
      listOfCuratedIdsOfMetabolites?.length > 0 &&
      ids.every((id) => Array.isArray(normalizedColumnData[id]))
    )
  }, [normalizedColumnData, listOfCuratedIdsOfMetabolites, ids])


  const extractedXData = listOfCuratedIdsOfMetabolites
  const extractedYData = ids
  const extractedZData = listOfCuratedIdsOfMetabolites?.map((metaboliteId, index) =>
    ids.map(id => normalizedColumnData[id] ? Number(normalizedColumnData[id][index]) : 0)
  ) || []

  const data: any[] = [{
    type: 'heatmap',
    hovertemplate: '<span style="font-size: 10px">Metabolite Curated ID:</span> <b>%{x}</b><br>' +
      '<span style="font-size: 10px">Sample ID:</span> <b>%{y}</b><br>' +
      '<span style="font-size: 10px">Normalized Abundance:</span> <b>%{z}</b>' +
      '<extra></extra>',
    y: extractedXData,
    x: extractedYData,
    z: extractedZData,
    zmin: -2.1,
    zmax: 2.1,
    colorbar: { // Normalized Abundance color scale
      y: 0.933, // postion of color bar from the bottom
      len: 300,
      lenmode: 'pixels',
      ticklabelposition: 'outside bottom',
      outlinewidth: 0,
      thickness: 24, // Width of the colorbar
      title: {
        text: 'Normalized Abundance', // Optional title for the colorbar
        side: 'right', // Position of the title
        font: { size: 12, weight: 'bold' }, // Font size for the title
      },
      tickfont: { size: 10 }, // Font size for the tick labels
      tickmode: 'array',
      tickvals: [-2.5, -2, -1, 0, 1, 2, 2.5], // Extra space beyond -2 and 2
      ticktext: ['', '-2', '-1', '0', '1', '2', ''], // Blank spaces for clipped values
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
      tickfont: { size: 8 },
    },
    margin: {
      t: 20, // Top margin
      b: 20, // Bottom margin
    },
    width: plotWidth,
    height: plotHeight,
  }

  const config: Partial<Config> = {
    displaylogo: false,
    displayModeBar: false,
    modeBarButtonsToRemove: ['toImage', 'lasso2d', 'pan2d', 'zoom2d', 'select2d'],
  }

  return (
    <>
      {isDataReady
        ?
        <div data-testid='plot-container'>
          <Plot data={data} layout={layout} config={config} />
        </div>
        :
        <div
          className='animate-pulse flex flex-col justify-center mx-auto px-12 py-16'
          data-testid='loading-skeleton'
          style={{ width: windowWidth, height: windowHeight }}
        >
          <div className='flex justify-center items-start gap-1 h-full w-full'>
            <div className='flex flex-col justify-evenly h-full'>
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className='bg-gray-200 w-12 h-3 rounded'></div>
              ))}
            </div>
            <div className='h-full w-full bg-gray-200 rounded mr-7'></div>
            <div className='h-[190px] w-6 bg-gray-200 rounded mr-16'></div>
          </div>
          <div className='ml-[64px] h-[160px] w-[calc(100%-64px-90px)] flex justify-evenly [&>div]:-rotate-[35deg]'>
            {Array.from({ length: 64 }).map((_, index) => (
              <div key={index} className='h-20 w-2 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default Heatmap