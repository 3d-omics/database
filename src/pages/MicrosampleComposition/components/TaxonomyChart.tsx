import { useState, useEffect, useMemo } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ErrorBanner from 'components/ErrorBanner'
import { dynamicXAxisPlugin, flattenedcolorScheme } from 'utils/chartUtils'
import { useTaxonomyData } from 'hooks/useTaxonomyData'
import { useTaxonomyChart } from 'hooks/useTaxonomyChart'
import { useGenomeJsonFile } from 'hooks/useJsonData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

// The chart fills the box its parent gives it, so the parent sets its size
const MicrosampleTaxonomyChart = ({ cryosection, microsampleIds, selectedTaxonomicLevel, isChangingLevel = false, experimentId }: {
  cryosection: string
  microsampleIds: string[]
  selectedTaxonomicLevel: string
  // Covers the chart while it is redrawn at a newly chosen level
  isChangingLevel?: boolean
  experimentId: string
}) => {

  const [isInitializing, setIsInitializing] = useState(true)

  // ===== Load genome metadata based on experimentId =====
  const metadataData = useGenomeJsonFile(
    'genome_metadata',
    `experiment_${experimentId}_metadata`
  )

  // ===== Load microsample counts for this cryosection =====
  const countsData = useGenomeJsonFile(
    'microsample_counts',
    cryosection
  )

  // ===== Load color scheme based on experimentId =====
  const colorScheme = useMemo(() => {
    try {
      const colorSchemeFiles = import.meta.glob(
        '/src/config/*.ts',
        { eager: true }
      )

      const colorSchemeModule =
        colorSchemeFiles[`/src/config/taxonomy-color-scheme.ts`];

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

  // ===== Fetch and process taxonomy data =====
  const { taxonomyData, genomeCounts, isDataReady, fetchError } = useTaxonomyData({
    metadataFile: metadataData,
    countsFile: countsData,
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

  // ===== Remove initial loading state after data is loaded =====
  useEffect(() => {
    if (countsData && metadataData) {
      const timer = setTimeout(() => setIsInitializing(false), 100)
      return () => clearTimeout(timer)
    }
  }, [countsData, metadataData])

  // ===== Error handling =====
  const hasError = !metadataData || !countsData || fetchError

  if (hasError) {
    return (
      <ErrorBanner>
        {fetchError || 'Failed to load taxonomy data'}
      </ErrorBanner>
    )
  }

  // Show full loading skeleton during initialization
  if (isInitializing || !isDataReady) {
    return <div className='h-full w-full animate-pulse bg-surface_strong rounded' />
  }

  return (
    <div className='relative h-full w-full'>
      <Bar data={chartData} options={options} />
      {/* Loading overlay - shows when changing levels */}
      {isChangingLevel && (
        <div className='absolute inset-0 bg-surface/80 flex items-center justify-center z-10'>
          <div className='flex flex-col items-center gap-3'>
            <div className='w-12 h-12 border-4 border-line_strong border-t-light_burgundy rounded-full animate-spin' />
            <p className='text-sm font-medium text-ink_muted'>Updating chart...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MicrosampleTaxonomyChart
