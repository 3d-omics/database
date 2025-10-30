import { useMemo } from 'react'

export interface TaxonomyData {
  [key: string]: string[]
  domain: string[]
  phylum: string[]
  class: string[]
  order: string[]
  family: string[]
  genus: string[]
  species: string[]
  genome: string[]
}

interface UseTaxonomyDataParams {
  metadataFile: Record<string, any[]> | null  
  countsFile: Record<string, any[]> | null    
  sampleIds: string[]
}

interface UseTaxonomyDataReturn {
  taxonomyData: TaxonomyData
  genomeCounts: number[][] | null
  isDataReady: boolean
  fetchError: string | null
}

export const useTaxonomyData = ({
  metadataFile,
  countsFile,
  sampleIds
}: UseTaxonomyDataParams): UseTaxonomyDataReturn => {

  // Extract taxonomy data from metadata
  const taxonomyData = useMemo<TaxonomyData>(() => {
    if (!metadataFile) {
      return {
        domain: [],
        phylum: [],
        class: [],
        order: [],
        family: [],
        genus: [],
        species: [],
        genome: [],
      }
    }

    return {
      domain: metadataFile.domain || [],
      phylum: metadataFile.phylum || [],
      class: metadataFile.class || [],
      order: metadataFile.order || [],
      family: metadataFile.family || [],
      genus: metadataFile.genus || [],
      species: metadataFile.species || [],
      genome: metadataFile.genome || [],
    }
  }, [metadataFile])

  // Calculate normalized genome counts
  const genomeCounts = useMemo<number[][] | null>(() => {
    if (!countsFile || !metadataFile || sampleIds.length === 0) {
      return null
    }

    // Calculate totals for each sample
    const total = Object.keys(countsFile).reduce((acc: any, key: string) => {
      if (key === 'genome') return acc
      acc[key] = countsFile[key].reduce((sum: number, value: any) =>
        sum + (parseFloat(value) || 0), 0)
      return acc
    }, {})

    // Get the order of genomes from metadata
    const genomeOrder = metadataFile.genome || []

    // Normalize counts by sample totals
    const normalizedCounts = sampleIds.map((id: string) => {
      const sampleCounts = countsFile[id] || []
      const totalSample = total[id] || 1

      // Reorder sampleCounts to match genomeOrder
      return genomeOrder.map((genome: string) => {
        const genomeIdx = (countsFile.genome || []).indexOf(genome)
        const value = genomeIdx !== -1 ? sampleCounts[genomeIdx] : 0
        return (parseFloat(value) || 0) / totalSample
      })
    })

    return normalizedCounts
  }, [countsFile, metadataFile, sampleIds])

  const isDataReady =
    sampleIds.length > 0 &&
    Object.keys(taxonomyData).length > 0 &&
    genomeCounts !== null &&
    genomeCounts.length > 0

  const fetchError = !metadataFile || !countsFile 
    ? 'Failed to load taxonomy data' 
    : null

  return {
    taxonomyData,
    genomeCounts,
    isDataReady,
    fetchError
  }
}




