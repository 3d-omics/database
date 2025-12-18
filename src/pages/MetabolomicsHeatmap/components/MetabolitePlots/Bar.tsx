import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { Layout, Config } from 'plotly.js'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'


const Barplot = ({ id, experimentId }: {
  id: string[]
  experimentId: string
}) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const { originalColumnData, listOfCuratedIdsOfMetabolites } = useMetaboliteExcelFileData({ experimentId })

  const plotWidth = listOfCuratedIdsOfMetabolites?.length * 9 < windowWidth
    ? windowWidth
    : listOfCuratedIdsOfMetabolites?.length * 9 || 0

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
      id.every((id) => Array.isArray(originalColumnData[id]))
    )
  }, [originalColumnData, listOfCuratedIdsOfMetabolites, id])

  const sampleId = id[0]
  const originalValues: number[] = originalColumnData[sampleId]?.map(Number) || []

  const sortedOriginalValues = [...originalValues].sort((a, b) => b - a)

  const sortedIdsWithValues = listOfCuratedIdsOfMetabolites?.map((id, index) => ({ id, value: originalValues[index] }))
    .sort((a, b) => b.value - a.value)

  const sortedCuratedIds = sortedIdsWithValues?.map(item => item.id)

  const data: any[] = [
    {
      x: sortedCuratedIds,
      y: sortedOriginalValues,
      type: 'bar',
      marker: { size: 6, color: '#BF910A' },
      hovertemplate: '<span style="font-size: 10px">Curated ID:</span> <b>%{x}</b><br>' +
        '<span style="font-size: 10px">Original Value:</span> <b>%{y}</b>' +
        '<extra></extra>',
    },
  ]

  const layout: Partial<Layout> = {
    showlegend: false,
    xaxis: {
      title: 'Curated Ids',
      dtick: 1,
      automargin: true,
      tickfont: { size: 8 },
      tickangle: 55,
    },
    yaxis: {
      title: 'Original Value',
      side: 'left',
    },
    width: plotWidth,
    height: windowHeight - 100,
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

export default Barplot


