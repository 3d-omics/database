import { useRef, useMemo, useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ErrorBanner from 'components/ErrorBanner'
import genome_metadata from 'assets/data/genome_metadata/experiment_G_metadata.csv'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import { flattenedcolorScheme, dynamicXAxisPlugin } from 'pages/Composition/utils/chartUtils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

const TaxonomyGraph = ({ cryosection, microsampleIds, selectedTaxonomicLevel, setSelectedTaxonomicLevel }: {
  cryosection: string
  microsampleIds: string[]
  selectedTaxonomicLevel: string
  setSelectedTaxonomicLevel: React.Dispatch<React.SetStateAction<string>>
}) => {

  const taxonomicLevels = ["phylum", "class", "order", "family", "genus", "species"]

  // ===== To get the width of the chart =====
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [chartWidth, setChartWidth] = useState<number | null>(null)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => (
    windowWidth >= 1280
      ? setChartWidth(windowWidth - ((35 * windowWidth / 100) + 320 + 48 + 16)) // 35% = ImagePlot, 320px = legend, 48px = padding x of page, 16px = margin left of the graph
      : windowWidth >= 768
        ? setChartWidth(windowWidth - (48 + 320 + 16))
        : setChartWidth(windowWidth - (32 + 32)) // 32px = padding x of page, 32px = margin x of the graph
  ), [windowWidth])


  // ===== fetching genome metadata and counts =====
  const [genomeCounts, setGenomeCounts] = useState<any>(null)
  const [taxonomyData, setTaxonomyData] = useState<Record<string, string[]>>({
    domain: [],
    phylum: [],
    class: [],
    order: [],
    family: [],
    genus: [],
    species: [],
  })

  const csvFiles = import.meta.glob('../../../assets/data/microsample_counts/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  });

  const csvUrl = csvFiles[`../../../assets/data/microsample_counts/${cryosection}.csv`];

  const { fetchExcel: fetchGenomeMetadata, fetchExcelError: fetchGenomeMetadataError } = useFetchExcelFileData({ excelFile: genome_metadata })
  const { fetchExcel: fetchGenomeCounts, fetchExcelError: fetchGenomeCountsError } = useFetchExcelFileData({ excelFile: csvUrl })

  useEffect(() => {

    Promise.all([fetchGenomeMetadata(), fetchGenomeCounts()]).then(([meta, counts]) => {
      if (meta) {
        setTaxonomyData({
          domain: meta.domain,
          phylum: meta.phylum,
          class: meta.class,
          order: meta.order,
          family: meta.family,
          genus: meta.genus,
          species: meta.species,
        })
      }

      if (counts) {
        const total = Object.keys(counts).reduce((acc: any, key: string) => {
          acc[key] = counts[key].reduce((sum: number, value: any) => sum + (parseFloat(value) || 0), 0)
          return acc
        }, {})
        const normalizedCounts = microsampleIds.map((id: string) => {
          const sampleCounts = counts[id] || []
          const totalSample = total[id] || 1
          return sampleCounts.map((v: any) => (parseFloat(v) || 0) / totalSample)
        })
        setGenomeCounts(normalizedCounts)
      }

    })
  }, [microsampleIds])


  // =================== for loading state ==========================

  const isDataReady = useMemo(() => {
    return (
      microsampleIds.length > 0 &&
      Object.keys(taxonomyData).length > 0 &&
      genomeCounts?.length > 0
    )
  }, [taxonomyData, genomeCounts, microsampleIds])




  // ======== chart data and options =======
  const { chartData, options } = useMemo(() => {
    if (!genomeCounts || !microsampleIds.length || !taxonomyData[selectedTaxonomicLevel]) {
      return { chartData: { labels: [], datasets: [] }, options: {} }
    }

    const taxonomyLabels = taxonomyData[selectedTaxonomicLevel].map(taxon => taxon.replace(/^[a-zA-Z]__/, ''))

    const datasets = taxonomyLabels.map((label, index) => {
      const data = genomeCounts?.map((counts: number[]) => counts[index] || 0)
      return {
        label,
        data,
        backgroundColor: flattenedcolorScheme[label] || '#000000',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 0,
      }
    })
      .sort((a, b) => {
        const aIndex = Object.keys(flattenedcolorScheme).indexOf(a.label)
        const bIndex = Object.keys(flattenedcolorScheme).indexOf(b.label)
        return bIndex - aIndex
      })

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: {
            autoSkip: false,
            // minRotation: 90,
            // font: { size: 8 },
          },
          title: {
            display: true,
            text: 'Microsample ID',
            font: { size: 12 }
          },
          grid: {
            display: false,
            drawTicks: false,
          },
        },
        y: {
          stacked: true,
          max: 1,
          ticks: {
            stepSize: 0.2,
            font: { size: 10 },
            // callback: function (value: any) { return (value * 100).toFixed(0) + '%'}   // ⬅️ to format as percenetage
          },
          title: {
            display: true,
            text: 'Relative Abundance',
            font: { size: 12 }
          },
          grid: {
            drawTicks: false,
          },
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || ''
              const value = context.parsed.y
              return `${label}: ${(value)}`
              // return `${label}: ${(value * 100).toFixed(2)}%`  // ⬅️ to format as percenetage
            },
          }
        },
        legend: { display: false },
      },
      animation: false as const,
      elements: {
        bar: { borderWidth: 0 }
      }
    }

    return {
      chartData: { labels: microsampleIds, datasets },
      // chartData: { labels: microsampleIds.map((_, i) => i), datasets },
      options
    }
  }, [microsampleIds, genomeCounts, taxonomyData, selectedTaxonomicLevel])


  // ===== error handling =====
  if (fetchGenomeMetadataError || fetchGenomeCountsError) {
    return (
      <section className='px-8'>
        <ErrorBanner>
          {[fetchGenomeMetadataError, fetchGenomeCountsError].filter(Boolean).join(' ')}
        </ErrorBanner>
      </section>
    )
  }

  return (
    <div className="grow flex flex-col pl-4 max-md:pl-0">

      {/* {isLoading */}
      {!isDataReady
        ?
        <div className="">
          <div className="animate-pulse flex flex-col w-[95%] max-w-3xl">
            <div className="h-6 bg-gray-200 rounded w-[80%] mb-4"></div>
            <div className="h-[70vh] bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        :
        <>
          <div className="flex items-center mb-3 px-3 taxonomic-level-buttons">
            <p className="text-sm font-bold mr-1.5 whitespace-nowrap">Taxonomic Level:</p>
            <div>
              {(chartWidth ?? 0) > 520
                ?
                taxonomicLevels.map((level) => (
                  <button
                    key={level}
                    className={`btn btn-xs border-none  mr-1 ${selectedTaxonomicLevel === level && "bg-light_burgundy text-white"}`}
                    onClick={() => setSelectedTaxonomicLevel(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))
                :
                <select
                  value={selectedTaxonomicLevel}
                  onChange={(e) => setSelectedTaxonomicLevel(e.target.value)}
                  className='btn btn-xs bg-gray-200 border-none outline-none'
                >
                  {taxonomicLevels.map((level) => (
                    <option value={level} key={level}>{level}</option>
                  ))}
                </select>
              }
            </div>
          </div>

          <div className='relative h-[78vh] w-[calc(100vw-(35vw+320px+48px+16px))]
              max-xl:w-[calc(100vw-(320px+48px+16px))] max-md:w-[calc(100vw-(32px+32px))]'
          // width of image plot (35%) // width of legend(320px) // padding x of page (48px | max-md:32px) // margin l of graph (16px)
          >
            <Bar data={chartData} options={options} />
          </div>
        </>
      }
    </div>
  )
}

export default TaxonomyGraph