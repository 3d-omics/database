import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { Layout, Config } from 'plotly.js'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'


const MetaboliteSpectrum = ({ id }: { id: string[] }) => {

  const { originalColumnData, listOfCuratedIdsOfMetabolites } = useMetaboliteExcelFileData()

  // Check if data is ready, if not, show a loading state
  const isDataReady = useMemo(() => {
    return (
      listOfCuratedIdsOfMetabolites.length > 0 &&
      id.every((id) => Array.isArray(originalColumnData[id]))
    )
  }, [originalColumnData, listOfCuratedIdsOfMetabolites, id])



  const sampleId = id[0]
  const originalValues: number[] = originalColumnData[sampleId]?.slice(0, 152).map(Number) || []

  // ====================== Calculate Z-score =======================

  const mean = originalValues.reduce((sum, value) => sum + value, 0) / originalValues.length;
  const stdDev = Math.sqrt(
    originalValues.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / originalValues.length
  )
  const zScores = originalValues.map(value => (value - mean) / stdDev)

  // // ====================== Calculate Normalized Abundance =======================

  // const min = Math.min(...originalValues);
  // const max = Math.max(...originalValues);
  // const normalizedAbundance = originalValues.map(value => (value - min) / (max - min));

  // // ====================== Calculate Normalized Z-score =======================

  // const meanNormalized = normalizedAbundance.reduce((sum, value) => sum + value, 0) / normalizedAbundance.length;
  // const stdDevNormalized = Math.sqrt(
  //   normalizedAbundance.reduce((sum, value) => sum + Math.pow(value - meanNormalized, 2), 0) / normalizedAbundance.length
  // )
  // const zScoresNormalized = normalizedAbundance.map(value => (value - meanNormalized) / stdDevNormalized)


  const data: any[] = [
    {
      x: listOfCuratedIdsOfMetabolites,
      y: originalValues,
      type: "scatter",
      mode: "lines",
      line: { color: "#BF910A", width: 2 },
      marker: { size: 6 },
    },
    {
      x: listOfCuratedIdsOfMetabolites,
      y: zScores,
      type: "scatter",
      mode: "lines",
      name: "Z Score Value",
      line: { color: "transparent", width: 2 },
      marker: { size: 6 },
      yaxis: 'y2',
      meta: originalValues,
      hovertemplate: '<span style="font-size: 10px">Curated ID:</span> <b>%{x}</b><br>' +
        '<span style="font-size: 10px">Original Value:</span> <b>%{meta}</b><br>' +
        '<span style="font-size: 10px">Z Score:</span> <b>%{y}</b>' +
        '<extra></extra>',
    },
  ]

  const layout: Partial<Layout> = {
    showlegend: false,
    // title: "Spectra Plot",
    xaxis: {
      title: "Curated Ids",
      dtick: 1,
      automargin: true,
      tickfont: { size: 8 },
      tickangle: 55,
    },
    yaxis: {
      title: "Original Value",
      side: "left",
    },
    yaxis2: {
      title: "Z Score",
      overlaying: "y",
      side: "right",
      // tickfont: { color: 'red' },
    },
    width: 1300,
    height: 600,
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
        <div className='animate-pulse h-[600px] w-[1300px] flex flex-col justify-center'>
          <div className='flex items-center gap-2'>
            <div className='h-32 w-6 bg-gray-200 rounded'></div>
            <div className='h-[300px] w-8 bg-gray-200 rounded'></div>
            <div className='h-[300px] w-[1134px] bg-gray-200 rounded'></div>
          </div>
          <div className='ml-[106px] h-[110px] w-[1134px] flex justify-between [&>div]:-rotate-[35deg]'>
            {Array.from({ length: 152 }).map((_, index) => (
              <div key={index} className='h-28 w-1 bg-gray-200 rounded'></div>
            ))}
          </div>
          <div className='h-6 w-32 mx-auto bg-gray-200 rounded'></div>
        </div>
        :
        <Plot data={data} layout={layout} config={config} />
      }
    </>
  );
}

export default MetaboliteSpectrum




