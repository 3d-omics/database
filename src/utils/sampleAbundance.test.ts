import { describe, expect, it } from 'vitest'
import { sampleAbundance } from './sampleAbundance'

describe('sampleAbundance', () => {
  it('joins genomes by ID, aggregates taxa, and normalizes one sample', () => {
    const result = sampleAbundance(
      { genome: ['g2', 'g1', 'g3'], M1: [30, 10, 10] },
      { genome: ['g1', 'g2', 'g3'], phylum: ['p__A', 'p__B', 'p__B'] },
      'M1',
      'phylum',
    )
    expect(result).toEqual([
      { name: 'B', fraction: 0.8 },
      { name: 'A', fraction: 0.2 },
    ])
  })

  it('does not invent an abundance when the count column is missing or empty', () => {
    const counts = { genome: ['g1'], M1: [0] }
    const metadata = { genome: ['g1'], phylum: ['p__A'] }
    expect(sampleAbundance(counts, metadata, 'M2', 'phylum')).toEqual([])
    expect(sampleAbundance(counts, metadata, 'M1', 'phylum')).toEqual([])
  })
})
