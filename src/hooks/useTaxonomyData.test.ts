import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTaxonomyData } from './useTaxonomyData'

describe('useTaxonomyData', () => {
  const mockMetadata = {
    domain: ['Bacteria', 'Bacteria', 'Archaea'],
    phylum: ['Firmicutes', 'Proteobacteria', 'Euryarchaeota'],
    class: ['Bacilli', 'Gammaproteobacteria', 'Methanobacteria'],
    order: ['Lactobacillales', 'Enterobacterales', 'Methanobacteriales'],
    genome: ['Genome1', 'Genome2', 'Genome3'],
  }

  const mockCounts = {
    genome: ['Genome1', 'Genome2', 'Genome3'],
    Sample1: [100, 200, 300],
    Sample2: [50, 100, 150],
  }

  it('returns correct structure', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: mockCounts,
        sampleIds: ['Sample1'],
      })
    )

    expect(result.current).toHaveProperty('taxonomyData')
    expect(result.current).toHaveProperty('genomeCounts')
    expect(result.current).toHaveProperty('isDataReady')
    expect(result.current).toHaveProperty('fetchError')
  })

  it('extracts taxonomy data from metadata', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: mockCounts,
        sampleIds: ['Sample1'],
      })
    )

    expect(result.current.taxonomyData.domain).toEqual(['Bacteria', 'Bacteria', 'Archaea'])
    expect(result.current.taxonomyData.phylum).toEqual(['Firmicutes', 'Proteobacteria', 'Euryarchaeota'])
    expect(result.current.taxonomyData.genome).toEqual(['Genome1', 'Genome2', 'Genome3'])
  })

  it('returns empty taxonomy when metadata is null', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: null,
        countsFile: mockCounts,
        sampleIds: ['Sample1'],
      })
    )

    expect(result.current.taxonomyData.domain).toEqual([])
    expect(result.current.taxonomyData.phylum).toEqual([])
    expect(result.current.taxonomyData.genome).toEqual([])
  })

  it('normalizes genome counts correctly', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: mockCounts,
        sampleIds: ['Sample1'],
      })
    )

    // Sample1 total: 100 + 200 + 300 = 600
    expect(result.current.genomeCounts).toEqual([
      [100 / 600, 200 / 600, 300 / 600],
    ])
  })

  it('handles multiple samples', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: mockCounts,
        sampleIds: ['Sample1', 'Sample2'],
      })
    )

    // Sample1 total: 600, Sample2 total: 300
    expect(result.current.genomeCounts).toHaveLength(2)
    expect(result.current.genomeCounts?.[0]).toEqual([100 / 600, 200 / 600, 300 / 600])
    expect(result.current.genomeCounts?.[1]).toEqual([50 / 300, 100 / 300, 150 / 300])
  })

  it('returns null genomeCounts when data is missing', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: null,
        sampleIds: ['Sample1'],
      })
    )

    expect(result.current.genomeCounts).toBeNull()
  })

  it('sets isDataReady correctly when all data present', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: mockCounts,
        sampleIds: ['Sample1'],
      })
    )

    expect(result.current.isDataReady).toBe(true)
  })

  it('sets isDataReady to false when sampleIds empty', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: mockCounts,
        sampleIds: [],
      })
    )

    expect(result.current.isDataReady).toBe(false)
  })

  it('returns error when metadata or counts missing', () => {
    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: null,
        countsFile: null,
        sampleIds: ['Sample1'],
      })
    )

    expect(result.current.fetchError).toBe('Failed to load taxonomy data')
  })

  it('reorders counts to match genome order from metadata', () => {
    const outOfOrderCounts = {
      genome: ['Genome3', 'Genome1', 'Genome2'], // Different order
      Sample1: [300, 100, 200],
    }

    const { result } = renderHook(() =>
      useTaxonomyData({
        metadataFile: mockMetadata,
        countsFile: outOfOrderCounts,
        sampleIds: ['Sample1'],
      })
    )

    // Should reorder to match metadata genome order: Genome1, Genome2, Genome3
    expect(result.current.genomeCounts).toEqual([
      [100 / 600, 200 / 600, 300 / 600],
    ])
  })
})