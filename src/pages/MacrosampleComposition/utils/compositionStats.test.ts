import { describe, it, expect } from 'vitest'
import { getCompositionStats } from './compositionStats'

// g4 is never detected and S3 has no mapped reads
const counts = {
  genome: ['g1', 'g2', 'g3', 'g4'],
  S1: [1, 1, 0, 0],
  S2: [1, 1, 2, 0],
  S3: [0, 0, 0, 0],
}
const metadata = {
  genome: ['g1', 'g2', 'g3', 'g4'],
  phylum: ['p__Bacillota', 'p__Bacillota', 'p__Bacteroidota', 'p__Pseudomonadota'],
}

const valueOf = (stats: ReturnType<typeof getCompositionStats>, label: string) =>
  stats.find((stat) => stat.label === label)?.value

describe('getCompositionStats', () => {
  it('counts the MAGs detected in at least one sample', () => {
    expect(valueOf(getCompositionStats(counts, metadata), 'Number of MAGs')).toBe('3')
  })

  it('counts the phyla of the detected MAGs only', () => {
    expect(valueOf(getCompositionStats(counts, metadata), 'Number of phyla')).toBe('2')
  })

  it('counts the samples with any mapped reads', () => {
    expect(valueOf(getCompositionStats(counts, metadata), 'Number of samples')).toBe('2')
  })

  it('averages the samples\' Shannon diversity as an effective number of MAGs', () => {
    // S1 has two equally abundant MAGs (2); S2 has abundances ¼, ¼, ½ (2^1.5 ≈ 2.83)
    const stats = getCompositionStats(counts, metadata)
    expect(valueOf(stats, 'Average Shannon diversity')).toBe('2.4')
    expect(stats.find((stat) => stat.label === 'Average Shannon diversity')?.unit).toBe('effective MAGs')
  })

  it('reads counts stored as strings', () => {
    const stringCounts = { genome: ['g1', 'g2'], S1: ['1', '1'] }
    expect(valueOf(getCompositionStats(stringCounts, metadata), 'Average Shannon diversity')).toBe('2.0')
  })

  it('skips the phylum of a MAG missing from the metadata', () => {
    const unknown = { genome: ['g1', 'g9'], S1: [1, 1] }
    expect(valueOf(getCompositionStats(unknown, metadata), 'Number of phyla')).toBe('1')
  })

  it('gives the MAG count a thousands separator', () => {
    const genome = Array.from({ length: 1200 }, (_, i) => `g${i}`)
    const many = { genome, S1: genome.map(() => 1) }
    expect(valueOf(getCompositionStats(many, { genome, phylum: genome.map(() => 'p__Bacillota') }), 'Number of MAGs')).toBe('1,200')
  })

  it('has no values for a trial without data', () => {
    for (const stats of [getCompositionStats(null, metadata), getCompositionStats(counts, null)]) {
      expect(stats.map((stat) => stat.label)).toEqual([
        'Number of MAGs', 'Number of phyla', 'Number of samples', 'Average Shannon diversity',
      ])
      expect(stats.every((stat) => stat.value === undefined)).toBe(true)
    }
  })
})
