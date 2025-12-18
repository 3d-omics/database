import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTaxonomyChart } from './useTaxonomyChart'
import { TaxonomyData } from './useTaxonomyData'

describe('useTaxonomyChart', () => {
  const mockTaxonomyData: TaxonomyData = {
    domain: ['d__Bacteria', 'd__Archaea'],
    phylum: ['p__Firmicutes', 'p__Proteobacteria'],
    class: ['c__Bacilli', 'c__Gammaproteobacteria'],
    order: ['o__Lactobacillales', 'o__Enterobacterales'],
    genome: ['Genome1', 'Genome2'],
  }

  const mockColorScheme = {
    Firmicutes: '#FF0000',
    Proteobacteria: '#00FF00',
  }

  it('returns empty chart when data is missing', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        sampleIds: [],
        genomeCounts: null,
        taxonomyData: mockTaxonomyData,
        selectedTaxonomicLevel: 'phylum',
        colorScheme: mockColorScheme,
        xAxisLabel: 'Samples',
      })
    )

    expect(result.current.chartData.labels).toEqual([])
    expect(result.current.chartData.datasets).toEqual([])
  })

  it('removes taxonomy prefixes from labels', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        sampleIds: ['Sample1'],
        genomeCounts: [[0.6, 0.4]],
        taxonomyData: mockTaxonomyData,
        selectedTaxonomicLevel: 'phylum',
        colorScheme: mockColorScheme,
        xAxisLabel: 'Samples',
      })
    )

    const labels = result.current.chartData.datasets.map(d => d.label)
    expect(labels).toContain('Firmicutes')
    expect(labels).toContain('Proteobacteria')
    expect(labels).not.toContain('p__Firmicutes')
  })

  it('creates datasets with correct data structure', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        sampleIds: ['Sample1', 'Sample2'],
        genomeCounts: [[0.6, 0.4], [0.3, 0.7]],
        taxonomyData: mockTaxonomyData,
        selectedTaxonomicLevel: 'phylum',
        colorScheme: mockColorScheme,
        xAxisLabel: 'Samples',
      })
    )

    expect(result.current.chartData.labels).toEqual(['Sample1', 'Sample2'])
    expect(result.current.chartData.datasets).toHaveLength(2)
    // Datasets are sorted reversed: Proteobacteria (index 1) first, then Firmicutes (index 0)
    expect(result.current.chartData.datasets[0].data).toEqual([0.4, 0.7]) // Proteobacteria
    expect(result.current.chartData.datasets[1].data).toEqual([0.6, 0.3]) // Firmicutes
  })

  it('applies colors from color scheme', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        sampleIds: ['Sample1'],
        genomeCounts: [[0.6, 0.4]],
        taxonomyData: mockTaxonomyData,
        selectedTaxonomicLevel: 'phylum',
        colorScheme: mockColorScheme,
        xAxisLabel: 'Samples',
      })
    )

    const firmicutesDataset = result.current.chartData.datasets.find(d => d.label === 'Firmicutes')
    expect(firmicutesDataset?.backgroundColor).toBe('#FF0000')
  })

  it('sorts datasets by color scheme order (reversed)', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        sampleIds: ['Sample1'],
        genomeCounts: [[0.6, 0.4]],
        taxonomyData: mockTaxonomyData,
        selectedTaxonomicLevel: 'phylum',
        colorScheme: mockColorScheme,
        xAxisLabel: 'Samples',
      })
    )

    // Color scheme keys: ['Firmicutes', 'Proteobacteria']
    // Reversed order for stacking: Proteobacteria should come first
    expect(result.current.chartData.datasets[0].label).toBe('Proteobacteria')
    expect(result.current.chartData.datasets[1].label).toBe('Firmicutes')
  })

  it('returns chart options with correct configuration', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        sampleIds: ['Sample1'],
        genomeCounts: [[0.6, 0.4]],
        taxonomyData: mockTaxonomyData,
        selectedTaxonomicLevel: 'phylum',
        colorScheme: mockColorScheme,
        xAxisLabel: 'Test Label',
      })
    )
  const options = result.current.options as any // Type assertion
  expect(options.scales.x.stacked).toBe(true)
  expect(options.scales.y.stacked).toBe(true)
  expect(options.scales.x.title.text).toBe('Test Label')
  })
})