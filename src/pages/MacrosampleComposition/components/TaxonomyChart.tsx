import { useMemo, useCallback, useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ErrorBanner from 'components/ErrorBanner'
import { dynamicXAxisPlugin, flattenedcolorScheme } from 'utils/chartUtils'
import { useTaxonomyData } from 'hooks/useTaxonomyData'
import { useTaxonomyChart } from 'hooks/useTaxonomyChart'
import { useGenomeJsonFile } from 'hooks/useJsonData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

const MacrosampleTaxonomyChart = ({
  selectedTaxonomicLevel,
  setSelectedTaxonomicLevel,
  experimentId
}: {
  selectedTaxonomicLevel: string
  setSelectedTaxonomicLevel: React.Dispatch<React.SetStateAction<string>>
  experimentId: string
}) => {
  const taxonomicLevels = ["phylum", "class", "order"]
  const [isInitializing, setIsInitializing] = useState(true)
  const [isChangingLevel, setIsChangingLevel] = useState(false)

  // Load counts and metadata data using helper hooks
  const countsData = useGenomeJsonFile(
    'macro_genome_counts',
    `experiment_${experimentId}_counts`
  )

  const metadataData = useGenomeJsonFile(
    'genome_metadata',
    `experiment_${experimentId}_metadata`
  )

  // Load color scheme
  const colorScheme = useMemo(() => {
    try {
      const colorSchemeFiles = import.meta.glob(
        '/src/config/colorScheme/*.ts',
        { eager: true }
      )

      const colorSchemeModule =
        colorSchemeFiles[`/src/config/colorScheme/taxonomy-color-scheme-${experimentId}.ts`]

      if (!colorSchemeModule) {
        console.warn(`Color scheme for experiment ${experimentId} not found, using default`)
        return {}
      }

      return (colorSchemeModule as any).colorScheme || {}
    } catch (error) {
      console.error('Error loading color scheme:', error)
      return {}
    }
  }, [experimentId])

  // Extract macrosample IDs from counts data
  const macrosampleIds = useMemo(() => {
    if (!countsData) return []
    return Object.keys(countsData).filter(key => key !== "genome")
  }, [countsData])

  // Fetch and process taxonomy data
  const { taxonomyData, genomeCounts, isDataReady, fetchError } = useTaxonomyData({
    metadataFile: metadataData,
    countsFile: countsData,
    sampleIds: macrosampleIds
  })

  // Memoize flattened color scheme
  const flattenedColors = useMemo(() =>
    flattenedcolorScheme(colorScheme),
    [colorScheme]
  )

  // Generate chart data and options
  const { chartData, options } = useTaxonomyChart({
    sampleIds: macrosampleIds,
    genomeCounts,
    taxonomyData,
    selectedTaxonomicLevel,
    colorScheme: flattenedColors,
    xAxisLabel: 'Macrosample ID',
  })

  // Handle taxonomic level change with loading state
  const handleLevelChange = useCallback((level: string) => {
    // Set loading state immediately
    setIsChangingLevel(true)

    // Use setTimeout to allow React to render the loading state first
    setTimeout(() => {
      setSelectedTaxonomicLevel(level)

      // Clear loading state after state update and re-render
      setTimeout(() => {
        setIsChangingLevel(false)
      }, 100)
    }, 0)
  }, [setSelectedTaxonomicLevel])

  // Remove initial loading state after data is loaded
  useEffect(() => {
    if (countsData && metadataData) {
      const timer = setTimeout(() => setIsInitializing(false), 100)
      return () => clearTimeout(timer)
    }
  }, [countsData, metadataData])

  // Error handling
  const hasError = !countsData || !metadataData || fetchError

  if (hasError) {
    return (
      <section className='h-[calc(100vh-var(--navbar-height))] p-12'>
        <ErrorBanner>
          {fetchError || 'Failed to load taxonomy data'}
        </ErrorBanner>
      </section>
    )
  }

  // Show full loading skeleton during initialization
  if (isInitializing || !isDataReady) {
    return (
      <div className='grow max-xl:min-w-full'>
        <div className="animate-pulse flex flex-col mb-16">
          <div className="h-6 bg-gray-200 rounded w-[30%] mb-4"></div>
          <div className="h-[70vh] bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className='grow max-xl:min-w-full'>
      <div>
        <div className="flex items-center mb-3 px-3 taxonomic-level-buttons">
          <p className="text-sm font-bold mr-1.5 whitespace-nowrap">Taxonomic Level:</p>
          <div>
            {taxonomicLevels.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                disabled={isChangingLevel}
                className={`btn btn-xs border-none mr-1 ${selectedTaxonomicLevel === level && "bg-light_burgundy text-white"
                  } ${isChangingLevel && "opacity-50 cursor-not-allowed"}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className='relative h-[78vh]'>
          <Bar data={chartData} options={options} />
          {/* Loading overlay - shows immediately when changing levels */}
          {isChangingLevel && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-light_burgundy rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-600">Loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MacrosampleTaxonomyChart
