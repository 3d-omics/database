import { useState, useEffect, useMemo, useCallback } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ErrorBanner from 'components/ErrorBanner'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import { dynamicXAxisPlugin, flattenedcolorScheme } from 'pages/Composition/utils/chartUtils'
import { useTaxonomyData } from 'hooks/useTaxonomyData'
import { useTaxonomyChart } from 'hooks/useTaxonomyChart'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

const MacrosampleTaxonomyChart = ({ selectedTaxonomicLevel, setSelectedTaxonomicLevel, experimentId }: {
  selectedTaxonomicLevel: string,
  setSelectedTaxonomicLevel: React.Dispatch<React.SetStateAction<string>>,
  experimentId: string,
}) => {

  const [macrosampleIds, setMacrosampleIds] = useState<string[]>([])

  const taxonomicLevels = ["phylum", "class", "order"]

  // ===== Memoize file URLs to prevent recalculation =====
  const { countsUrl, metadataUrl, colorScheme } = useMemo(() => {
    const countsFiles = import.meta.glob('../../../assets/data/macro_genome_counts/*.csv', {
      eager: true,
      query: '?url',
      import: 'default'
    })
    const countsUrl = countsFiles[`../../../assets/data/macro_genome_counts/experiment_${experimentId}_counts.csv`]

    const metadataFiles = import.meta.glob('../../../assets/data/genome_metadata/*.csv', {
      eager: true,
      query: '?url',
      import: 'default'
    })
    const metadataUrl = metadataFiles[`../../../assets/data/genome_metadata/experiment_${experimentId}_metadata.csv`]

    const colorSchemeFiles = import.meta.glob('../../../config/colorScheme/*.ts', {
      eager: true,
    })
    const colorSchemeModule =
      colorSchemeFiles[`../../../config/colorScheme/taxonomy-color-scheme-${experimentId}.ts`]

    if (!colorSchemeModule) {
      throw new Error(`Color scheme for experiment ${experimentId} not found`)
    }
    const colorScheme = (colorSchemeModule && (colorSchemeModule as any).colorScheme) 
      ? (colorSchemeModule as any).colorScheme 
      : {}

    return { countsUrl, metadataUrl, colorScheme }
  }, [experimentId])

  const { fetchExcel, fetchExcelError } = useFetchExcelFileData({ excelFile: countsUrl })

  // ===== Fetch macrosample IDs from CSV file =====
  useEffect(() => {
    let isMounted = true
    fetchExcel().then((columnData: any) => {
      if (columnData && isMounted) {
        setMacrosampleIds(Object.keys(columnData).filter(key => key !== "genome"))
      }
    })
    return () => { isMounted = false }
  }, [fetchExcel])

  // ===== Fetch and process taxonomy data =====
  const { taxonomyData, genomeCounts, isDataReady, fetchError } = useTaxonomyData({
    metadataFile: typeof metadataUrl === 'string' ? metadataUrl : '',
    countsFile: typeof countsUrl === 'string' ? countsUrl : '',
    sampleIds: macrosampleIds
  })

  // ===== Memoize flattened color scheme =====
  const flattenedColors = useMemo(() => 
    flattenedcolorScheme(colorScheme), 
    [colorScheme]
  )

  // ===== Generate chart data and options =====
  const { chartData, options } = useTaxonomyChart({
    sampleIds: macrosampleIds,
    genomeCounts,
    taxonomyData,
    selectedTaxonomicLevel,
    colorScheme: flattenedColors,
    xAxisLabel: 'Macrosample ID',
  })

  // ===== Memoize button handler =====
  const handleLevelChange = useCallback((level: string) => {
    setSelectedTaxonomicLevel(level)
  }, [setSelectedTaxonomicLevel])

  // ===== Error handling =====
  if (fetchError || fetchExcelError) {
    return (
      <section className='h-[calc(100vh-var(--navbar-height))] p-12'>
        <ErrorBanner>{fetchError || fetchExcelError}</ErrorBanner>
      </section>
    )
  }

  return (
    <div className='grow max-xl:min-w-full'>
      {!isDataReady ? (
        <div className="animate-pulse flex flex-col mb-16">
          <div className="h-6 bg-gray-200 rounded w-[30%] mb-4"></div>
          <div className="h-[70vh] bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-3 px-3 taxonomic-level-buttons">
            <p className="text-sm font-bold mr-1.5 whitespace-nowrap">Taxonomic Level:</p>
            <div>
              {taxonomicLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`btn btn-xs border-none mr-1 ${selectedTaxonomicLevel === level && "bg-light_burgundy text-white"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className='relative h-[78vh]'>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  )
}

export default MacrosampleTaxonomyChart