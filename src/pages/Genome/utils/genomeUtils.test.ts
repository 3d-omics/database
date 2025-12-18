import { describe, it, expect } from 'vitest'
import { processCounts } from './genomeUtils'

describe('processCounts', () => {
  const mockCounts = {
    genome: ['Genome1', 'Genome2', 'Genome3'],
    Sample1: [100, 200, 300],
    Sample2: [50, 100, 150],
    Sample3: [0, 0, 0],
  }

  it('calculates relative abundance correctly', () => {
    const result = processCounts(mockCounts, 'Genome1')

    // Sample1: 100 / (100 + 200 + 300) = 100/600 = 0.1667
    // Sample2: 50 / (50 + 100 + 150) = 50/300 = 0.1667
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 'Sample1', count: 100 / 600 })
    expect(result[1]).toEqual({ id: 'Sample2', count: 50 / 300 })
  })

  it('filters out samples with zero count', () => {
    const result = processCounts(mockCounts, 'Genome1')

    // Sample3 has 0 count, should be filtered out
    expect(result.every(item => item.id !== 'Sample3')).toBe(true)
  })

  it('returns empty array when counts is null', () => {
    const result = processCounts(null, 'Genome1')
    expect(result).toEqual([])
  })

  it('returns empty array when genome array is missing', () => {
    const invalidCounts = { Sample1: [100, 200] }
    const result = processCounts(invalidCounts, 'Genome1')
    expect(result).toEqual([])
  })

  it('returns empty array when genome not found', () => {
    const result = processCounts(mockCounts, 'NonExistentGenome')
    expect(result).toEqual([])
  })

  it('handles samples with all zero values', () => {
    const allZeroCounts = {
      genome: ['Genome1', 'Genome2'],
      Sample1: [0, 0],
    }

    const result = processCounts(allZeroCounts, 'Genome1')
    expect(result).toEqual([])
  })

  it('handles non-numeric values gracefully', () => {
    const invalidValueCounts = {
      genome: ['Genome1'],
      Sample1: ['invalid', 100],
      Sample2: [50, 'invalid'],
    }

    const result = processCounts(invalidValueCounts, 'Genome1')

    // Should treat 'invalid' as 0
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('Sample2')
  })

  it('normalizes by total when calculating relative abundance', () => {
    const simpleCounts = {
      genome: ['Genome1'],
      Sample1: [300], // Only one genome, so 300/300 = 1.0
    }

    const result = processCounts(simpleCounts, 'Genome1')

    expect(result[0].count).toBe(1.0)
  })
})