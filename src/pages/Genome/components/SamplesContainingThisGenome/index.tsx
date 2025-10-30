import { useState, useMemo } from 'react'
import Tabs from 'components/Tabs'
import MacrosampleTab from './components/MacrosampleTab'
import MicrosampleTab from './components/MicrosampleTab'
import { useParams } from 'react-router-dom'
import { useGenomeJsonFile, useAllMicrosampleCounts } from 'hooks/useJsonData'

type SampleData = Array<{ id: string; count: any }>

const SamplesContainingThisGenome = ({ genomeName }: { genomeName: string }) => {
  const [selectedTab, setSelectedTab] = useState('Macrosample')
  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  // Load ONLY the macro genome counts for this specific experiment
  const macroCounts = useGenomeJsonFile(
    'macro_genome_counts',
    `experiment_${experimentId}_counts`
  )

  // Load ALL microsample counts (all 65 files)
  const allMicrosampleCounts = useAllMicrosampleCounts()

  // Helper function to process counts
  const processCounts = (
    counts: Record<string, any[]> | null,
    genomeName: string
  ): SampleData => {
    if (!counts || !counts.genome || !Array.isArray(counts.genome)) {
      return []
    }
    
    const genomeIndex = counts.genome.indexOf(genomeName)
    if (genomeIndex === -1) {
      return []
    }
    
    return Object.entries(counts)
      .filter(([key]) => key !== 'genome')
      .map(([id, arr]) => ({
        id,
        count: Array.isArray(arr) ? arr[genomeIndex] : undefined,
      }))
      .filter(item => item.count)
  }

  // Process macrosample data (single file for this experiment)
  const macrosampleIds = useMemo(() => {
    return processCounts(macroCounts, genomeName)
  }, [macroCounts, genomeName])

  // Process microsample data (aggregate from ALL 65 files)
  const microsampleIds = useMemo(() => {
    const allMicrosampleIds: SampleData = []

    // Go through all 65 microsample count files
    allMicrosampleCounts.forEach(({ data }) => {
      const processed = processCounts(data, genomeName)
      allMicrosampleIds.push(...processed)
    })

    return allMicrosampleIds
  }, [allMicrosampleCounts, genomeName])

  // Check for errors (data not loaded)
  const macroError = !macroCounts ? 'Failed to load macrosample data' : null
  const microError = allMicrosampleCounts.length === 0 ? 'Failed to load microsample data' : null

  return (
    <div className=''>
      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={['Macrosample', 'Microsample']}
      />
      <div className='h-6'></div>
      {selectedTab === 'Macrosample' && (
        <MacrosampleTab
          data={macrosampleIds}
          genomeName={genomeName}
          isLoading={false}
          error={macroError}
        />
      )}
      {selectedTab === 'Microsample' && (
        <MicrosampleTab
          data={microsampleIds}
          genomeName={genomeName}
          isLoading={false}
          error={microError}
        />
      )}
    </div>
  )
}

export default SamplesContainingThisGenome
