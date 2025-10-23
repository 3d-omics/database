import { useState, useEffect } from 'react'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'

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
  metadataFile: string
  countsFile: string
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

  const [genomeCounts, setGenomeCounts] = useState<number[][] | null>(null)
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData>({
    domain: [],
    phylum: [],
    class: [],
    order: [],
    family: [],
    genus: [],
    species: [],
    genome: [],
  })
  // const [sampleIds, setSampleIds] = useState<string[]>([])


  const { fetchExcel: fetchGenomeMetadata, fetchExcelError: fetchGenomeMetadataError } =
    useFetchExcelFileData({ excelFile: metadataFile })
  const { fetchExcel: fetchGenomeCounts, fetchExcelError: fetchGenomeCountsError } =
    useFetchExcelFileData({ excelFile: countsFile })

  useEffect(() => {
    if (sampleIds.length === 0) return

    Promise.all([fetchGenomeMetadata(), fetchGenomeCounts()]).then(([meta, counts]) => {
      if (meta) {
        setTaxonomyData({
          domain: meta.domain || [],
          phylum: meta.phylum || [],
          class: meta.class || [],
          order: meta.order || [],
          family: meta.family || [],
          genus: meta.genus || [],
          species: meta.species || [],
          genome: meta.genome || [],
        })
      }

      if (counts) {
        // console.log(counts)
        // set sampleIds
        // setSampleIds(Object.keys(counts).filter(key => key === 'genome'))
        // console.log('sample ids====>>>',Object.keys(counts).filter(key => key !== 'genome'))

        // Calculate totals for each sample
        const total = Object.keys(counts).reduce((acc: any, key: string) => {
          acc[key] = counts[key].reduce((sum: number, value: any) =>
            sum + (parseFloat(value) || 0), 0)
          return acc
        }, {})

        // Get the order of genomes from metadata
        const genomeOrder = meta?.genome || []

        // Normalize counts by sample totals
        const normalizedCounts = sampleIds.map((id: string) => {
          const sampleCounts = counts[id] || []
          const totalSample = total[id] || 1

          // Reorder sampleCounts to match genomeOrder
          return genomeOrder.map((genome: string) => {
            const genomeIdx = (counts.genome || []).indexOf(genome)
            const value = genomeIdx !== -1 ? sampleCounts[genomeIdx] : 0
            return (parseFloat(value) || 0) / totalSample
          })
        })

        setGenomeCounts(normalizedCounts)
      }
    })
  }, [sampleIds, metadataFile, countsFile ])

  const isDataReady =
    sampleIds.length > 0 &&
    Object.keys(taxonomyData).length > 0 &&
    genomeCounts !== null &&
    genomeCounts.length > 0

  const fetchError = [fetchGenomeMetadataError, fetchGenomeCountsError]
    .filter(Boolean)
    .join(' ') || null

  return {
    taxonomyData,
    genomeCounts,
    isDataReady,
    fetchError
  }
}