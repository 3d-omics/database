import { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ErrorBanner from 'components/ErrorBanner'
import genome_metadata from 'assets/data/genome_metadata/experiment_G_metadata.csv' // using this csv directly because for microsample composition barstack plot is only for experiment G
import { dynamicXAxisPlugin, flattenedcolorScheme } from 'pages/Composition/utils/chartUtils'
import { useTaxonomyData } from 'hooks/useTaxonomyData'
import { useTaxonomyChart } from 'hooks/useTaxonomyChart'
import { colorScheme } from 'config/colorScheme/taxonomy-color-scheme-G' // using this color scheme directly because for microsample composition barstack plot is only for experiment G


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

const TaxonomyChart = ({ cryosection, microsampleIds, selectedTaxonomicLevel, setSelectedTaxonomicLevel }: {
  cryosection: string
  microsampleIds: string[]
  selectedTaxonomicLevel: string
  setSelectedTaxonomicLevel: React.Dispatch<React.SetStateAction<string>>
}) => {
  const taxonomicLevels = ["phylum", "class", "order", "family", "genus", "species"]

  // ===== Chart width calculation =====
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [chartWidth, setChartWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (windowWidth >= 1280) {
      setChartWidth(windowWidth - ((35 * windowWidth / 100) + 320 + 48 + 16))
    } else if (windowWidth >= 768) {
      setChartWidth(windowWidth - (48 + 320 + 16))
    } else {
      setChartWidth(windowWidth - (32 + 32))
    }
  }, [windowWidth])

  // ===== Get counts file for the cryosection =====
  const csvFiles = import.meta.glob('../../../assets/data/microsample_counts/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  })
  const csvUrl = csvFiles[`../../../assets/data/microsample_counts/${cryosection}.csv`]

  // ===== Fetch and process taxonomy data =====
  const { taxonomyData, genomeCounts, isDataReady, fetchError } = useTaxonomyData({
    metadataFile: genome_metadata,
    countsFile: typeof csvUrl === 'string' ? csvUrl : '',
    sampleIds: microsampleIds
  })


  // ===== Generate chart data and options =====
  const { chartData, options } = useTaxonomyChart({
    sampleIds: microsampleIds,
    genomeCounts,
    taxonomyData,
    selectedTaxonomicLevel,
    colorScheme: flattenedcolorScheme(colorScheme),
    xAxisLabel: 'Microsample ID',
  })

  // ===== Error handling =====
  if (fetchError) {
    return (
      <section className='px-8'>
        <ErrorBanner>{fetchError}</ErrorBanner>
      </section>
    )
  }

  return (
    <div className="grow flex flex-col pl-4 max-md:pl-0">
      {!isDataReady ? (
        <div className="">
          <div className="animate-pulse flex flex-col w-[95%] max-w-3xl">
            <div className="h-6 bg-gray-200 rounded w-[80%] mb-4"></div>
            <div className="h-[70vh] bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-3 px-3 taxonomic-level-buttons">
            <p className="text-sm font-bold mr-1.5 whitespace-nowrap">Taxonomic Level:</p>
            <div>
              {(chartWidth ?? 0) > 520 ? (
                taxonomicLevels.map((level) => (
                  <button
                    key={level}
                    className={`btn btn-xs border-none mr-1 ${selectedTaxonomicLevel === level && "bg-light_burgundy text-white"
                      }`}
                    onClick={() => setSelectedTaxonomicLevel(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))
              ) : (
                <select
                  value={selectedTaxonomicLevel}
                  onChange={(e) => setSelectedTaxonomicLevel(e.target.value)}
                  className='btn btn-xs bg-gray-200 border-none outline-none'
                >
                  {taxonomicLevels.map((level) => (
                    <option value={level} key={level}>{level}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className='relative h-[78vh] w-[calc(100vw-(35vw+320px+48px+16px))]
              max-xl:w-[calc(100vw-(320px+48px+16px))] max-md:w-[calc(100vw-(32px+32px))]'>
            <Bar data={chartData} options={options} />
          </div>
        </>
      )}
    </div>
  )
}

export default TaxonomyChart