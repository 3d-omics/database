import { renderHook } from '@testing-library/react'
import { useTaxonomyChart } from './useTaxonomyChart'
import { TaxonomyData } from './useTaxonomyData'
import { to } from 'mathjs'

describe('useTaxonomyChart', () => {
  const mockTaxonomyData: TaxonomyData = {
    genome: ['genome1', 'genome2', 'genome3'],
    domain: ['d__Bacteria', 'd__Bacteria', 'd__Archaea'],
    phylum: ['p__Proteobacteria', 'p__Firmicutes', 'p__Euryarchaeota'],
    class: ['c__Gammaproteobacteria', 'c__Bacilli', 'c__Methanobacteria'],
    order: ['o__Enterobacterales', 'o__Lactobacillales', 'o__Methanobacteriales'],
    family: ['f__Enterobacteriaceae', 'f__Lactobacillaceae', 'f__Methanobacteriaceae'],
    genus: ['g__Escherichia', 'g__Lactobacillus', 'g__Methanobrevibacter'],
    species: ['s__Escherichia_coli', 's__Lactobacillus_acidophilus', 's__Methanobrevibacter_smithii'],
  }

  const mockGenomeCounts = [
    [0.3, 0.5, 0.2], // Sample 1: 30% genome1, 50% genome2, 20% genome3
    [0.4, 0.4, 0.2], // Sample 2: 40% genome1, 40% genome2, 20% genome3
  ]

  const mockColorScheme = {
    'Proteobacteria': '#FF0000',
    'Firmicutes': '#00FF00',
    'Euryarchaeota': '#0000FF',
  }

  const defaultParams = {
    sampleIds: ['SAMPLE001', 'SAMPLE002'],
    genomeCounts: mockGenomeCounts,
    taxonomyData: mockTaxonomyData,
    selectedTaxonomicLevel: 'phylum',
    colorScheme: mockColorScheme,
    xAxisLabel: 'Sample ID',
  }

  it('returns empty chart data when genomeCounts is null', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        ...defaultParams,
        genomeCounts: null,
      })
    )

    expect(result.current.chartData.labels).toEqual([])
    expect(result.current.chartData.datasets).toEqual([])
  })

  it('returns empty chart data when sampleIds is empty', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        ...defaultParams,
        sampleIds: [],
      })
    )

    expect(result.current.chartData.labels).toEqual([])
    expect(result.current.chartData.datasets).toEqual([])
  })

  it('removes taxonomy prefixes from labels', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    const labels = result.current.chartData.datasets.map(d => d.label)
    expect(labels).toContain('Proteobacteria') // Not 'p__Proteobacteria'
    expect(labels).toContain('Firmicutes')
    expect(labels).toContain('Euryarchaeota')
  })

  it('creates correct number of datasets', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    // Should have 3 datasets (3 phyla)
    expect(result.current.chartData.datasets).toHaveLength(3)
  })

  it('assigns correct data to each dataset', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    const proteobacteriaDataset = result.current.chartData.datasets.find(
      d => d.label === 'Proteobacteria'
    )

    // First genome is Proteobacteria, so data should be [0.3, 0.4]
    expect(proteobacteriaDataset?.data).toEqual([0.3, 0.4])
  })

  it('applies colors from color scheme', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    const proteobacteriaDataset = result.current.chartData.datasets.find(
      d => d.label === 'Proteobacteria'
    )

    expect(proteobacteriaDataset?.backgroundColor).toBe('#FF0000')
  })

  it('uses fallback color for unknown taxa', () => {
    const limitedColorScheme = {
      'Proteobacteria': '#FF0000',
      // Missing Firmicutes and Euryarchaeota
    }

    const { result } = renderHook(() =>
      useTaxonomyChart({
        ...defaultParams,
        colorScheme: limitedColorScheme,
      })
    )

    const firmicutesDataset = result.current.chartData.datasets.find(
      d => d.label === 'Firmicutes'
    )

    expect(firmicutesDataset?.backgroundColor).toBe('#CCCCCC') // Fallback color
  })

  it('sorts datasets by color scheme order (reversed)', () => {
    const orderedColorScheme = {
      'Proteobacteria': '#FF0000',  // Index 0
      'Firmicutes': '#00FF00',      // Index 1
      'Euryarchaeota': '#0000FF',   // Index 2
    }

    const { result } = renderHook(() =>
      useTaxonomyChart({
        ...defaultParams,
        colorScheme: orderedColorScheme,
      })
    )

    // Should be reversed: Euryarchaeota, Firmicutes, Proteobacteria
    const labels = result.current.chartData.datasets.map(d => d.label)
    expect(labels[0]).toBe('Euryarchaeota')
    expect(labels[1]).toBe('Firmicutes')
    expect(labels[2]).toBe('Proteobacteria')
  })

  it('uses sample IDs as chart labels', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    expect(result.current.chartData.labels).toEqual(['SAMPLE001', 'SAMPLE002'])
  })

  it('configures stacked bar chart correctly', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    const options = result.current.options as any
    expect(options.scales.x.stacked).toBe(true)
    expect(options.scales.y.stacked).toBe(true)
    expect(options.scales.y.max).toBe(1)
  })

  it('sets correct axis labels', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    const options = result.current.options as any
    expect(options.scales.x.title.text).toBe('Sample ID')
    expect(options.scales.y.title.text).toBe('Relative Abundance')
  })

  it('disables legend', () => {
    const { result } = renderHook(() => useTaxonomyChart(defaultParams))

    expect(result.current.options).toHaveProperty('plugins.legend.display', false)
  })

  it('works with different taxonomic levels', () => {
    const { result: phylumResult } = renderHook(() =>
      useTaxonomyChart({ ...defaultParams, selectedTaxonomicLevel: 'phylum' })
    )
    expect(phylumResult.current.chartData.datasets).toHaveLength(3)

    const { result: classResult } = renderHook(() =>
      useTaxonomyChart({ ...defaultParams, selectedTaxonomicLevel: 'class' })
    )
    expect(classResult.current.chartData.datasets).toHaveLength(3)
  })

  it('updates when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ taxonomicLevel }) =>
        useTaxonomyChart({
          ...defaultParams,
          selectedTaxonomicLevel: taxonomicLevel,
        }),
      { initialProps: { taxonomicLevel: 'phylum' } }
    )

    const initialLabels = result.current.chartData.datasets.map(d => d.label)
    expect(initialLabels).toContain('Proteobacteria')

    // Change taxonomic level
    rerender({ taxonomicLevel: 'class' })

    const updatedLabels = result.current.chartData.datasets.map(d => d.label)
    expect(updatedLabels).toContain('Gammaproteobacteria')
    expect(updatedLabels).not.toContain('Proteobacteria')
  })

  it('sets custom x-axis label', () => {
    const { result } = renderHook(() =>
      useTaxonomyChart({
        ...defaultParams,
        xAxisLabel: 'Microsample ID',
      })
    )
    const options = result.current.options as any
    expect(options.scales.x.title.text).toBe('Microsample ID')
  })
})