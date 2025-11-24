import { renderHook } from '@testing-library/react'
import { useTaxonomyData } from './useTaxonomyData'

describe('useTaxonomyData', () => {
  const mockMetadataFile = {
    genome: ['genome1', 'genome2', 'genome3'],
    domain: ['d__Bacteria', 'd__Bacteria', 'd__Archaea'],
    phylum: ['p__Proteobacteria', 'p__Firmicutes', 'p__Euryarchaeota'],
    class: ['c__Gammaproteobacteria', 'c__Bacilli', 'c__Methanobacteria'],
    order: ['o__Enterobacterales', 'o__Lactobacillales', 'o__Methanobacteriales'],
    family: ['f__Enterobacteriaceae', 'f__Lactobacillaceae', 'f__Methanobacteriaceae'],
    genus: ['g__Escherichia', 'g__Lactobacillus', 'g__Methanobrevibacter'],
    species: ['s__Escherichia_coli', 's__Lactobacillus_acidophilus', 's__Methanobrevibacter_smithii'],
  }

  const mockCountsFile = {
    genome: ['genome1', 'genome2', 'genome3'],
    SAMPLE001: [100, 200, 50],
    SAMPLE002: [150, 100, 100],
  }

  it('returns empty taxonomy data when metadataFile is null', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: null,
        countsFile: mockCountsFile,
        sampleIds: ['SAMPLE001'],
      })
    )

    expect(result.current.taxonomyData.genome).toEqual([])
    expect(result.current.taxonomyData.phylum).toEqual([])
    expect(result.current.isDataReady).toBe(false)
    expect(result.current.fetchError).toBe('Failed to load taxonomy data')
  })

  it('returns null genomeCounts when countsFile is null', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: null,
        sampleIds: ['SAMPLE001'],
      })
    )

    expect(result.current.genomeCounts).toBeNull()
    expect(result.current.isDataReady).toBe(false)
    expect(result.current.fetchError).toBe('Failed to load taxonomy data')
  })

  it('returns null genomeCounts when sampleIds is empty', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: mockCountsFile,
        sampleIds: [],
      })
    )

    expect(result.current.genomeCounts).toBeNull()
    expect(result.current.isDataReady).toBe(false)
  })

  it('extracts taxonomy data correctly from metadataFile', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: mockCountsFile,
        sampleIds: ['SAMPLE001'],
      })
    )

    expect(result.current.taxonomyData.genome).toEqual(['genome1', 'genome2', 'genome3'])
    expect(result.current.taxonomyData.phylum).toEqual([
      'p__Proteobacteria',
      'p__Firmicutes',
      'p__Euryarchaeota',
    ])
    expect(result.current.taxonomyData.domain).toEqual([
      'd__Bacteria',
      'd__Bacteria',
      'd__Archaea',
    ])
  })

  it('normalizes genome counts correctly', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: mockCountsFile,
        sampleIds: ['SAMPLE001'],
      })
    )

    // SAMPLE001: [100, 200, 50] -> total = 350
    // Normalized: [100/350, 200/350, 50/350] = [0.286, 0.571, 0.143]
    expect(result.current.genomeCounts).not.toBeNull()
    expect(result.current.genomeCounts![0]).toHaveLength(3)
    expect(result.current.genomeCounts![0][0]).toBeCloseTo(100 / 350, 2)
    expect(result.current.genomeCounts![0][1]).toBeCloseTo(200 / 350, 2)
    expect(result.current.genomeCounts![0][2]).toBeCloseTo(50 / 350, 2)
  })

  it('normalizes counts for multiple samples', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: mockCountsFile,
        sampleIds: ['SAMPLE001', 'SAMPLE002'],
      })
    )

    expect(result.current.genomeCounts).toHaveLength(2)
    
    // SAMPLE001: total = 350
    expect(result.current.genomeCounts![0][0]).toBeCloseTo(100 / 350, 2)
    
    // SAMPLE002: [150, 100, 100] -> total = 350
    expect(result.current.genomeCounts![1][0]).toBeCloseTo(150 / 350, 2)
    expect(result.current.genomeCounts![1][1]).toBeCloseTo(100 / 350, 2)
  })

  it('handles missing sample data gracefully', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: mockCountsFile,
        sampleIds: ['NONEXISTENT'],
      })
    )

    // Should return all zeros when sample doesn't exist
    expect(result.current.genomeCounts).toHaveLength(1)
    expect(result.current.genomeCounts![0]).toEqual([0, 0, 0])
  })

  it('reorders counts to match genome order', () => {
    const shuffledCountsFile = {
      genome: ['genome3', 'genome1', 'genome2'], // Different order
      SAMPLE001: [50, 100, 200], // Values correspond to shuffled order
    }

    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: shuffledCountsFile,
        sampleIds: ['SAMPLE001'],
      })
    )

    // Should reorder to match metadata genome order [genome1, genome2, genome3]
    // Original: genome3=50, genome1=100, genome2=200
    // Reordered: genome1=100, genome2=200, genome3=50
    const total = 350
    expect(result.current.genomeCounts![0][0]).toBeCloseTo(100 / total, 2) // genome1
    expect(result.current.genomeCounts![0][1]).toBeCloseTo(200 / total, 2) // genome2
    expect(result.current.genomeCounts![0][2]).toBeCloseTo(50 / total, 2) // genome3
  })

  it('sets isDataReady to true when all data is available', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: mockCountsFile,
        sampleIds: ['SAMPLE001'],
      })
    )

    expect(result.current.isDataReady).toBe(true)
    expect(result.current.fetchError).toBeNull()
  })

  it('handles zero or invalid count values', () => {
    const countsWithZeros = {
      genome: ['genome1', 'genome2', 'genome3'],
      SAMPLE001: [0, 0, 0],
    }

    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadataFile,
        countsFile: countsWithZeros,
        sampleIds: ['SAMPLE001'],
      })
    )

    // Should handle division by zero (total = 0)
    expect(result.current.genomeCounts).toHaveLength(1)
    expect(result.current.genomeCounts![0]).toEqual([0, 0, 0])
  })

  it('updates when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ sampleIds }) =>
        useTaxonomyData({
          metadataFile: mockMetadataFile,
          countsFile: mockCountsFile,
          sampleIds,
        }),
      { initialProps: { sampleIds: ['SAMPLE001'] } }
    )

    expect(result.current.genomeCounts).toHaveLength(1)

    // Change sampleIds
    rerender({ sampleIds: ['SAMPLE001', 'SAMPLE002'] })

    expect(result.current.genomeCounts).toHaveLength(2)
  })
})