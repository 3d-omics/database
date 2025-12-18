import { describe, it, expect, vi } from 'vitest'
import { getPhylumColor } from './phylumColorScheme'

// Mock the config import
vi.mock('config/taxonomy-color-scheme', () => ({
  colorScheme: {
    Firmicutes: { color: '#FF0000' },
    Proteobacteria: { color: '#00FF00' },
    Bacteroidetes: { color: '#0000FF' },
  },
}))

describe('phylum color scheme', () => {
  it('returns correct color for known phylum', () => {
    expect(getPhylumColor('Firmicutes')).toBe('#FF0000')
    expect(getPhylumColor('Proteobacteria')).toBe('#00FF00')
  })

  it('returns default color for unknown phylum', () => {
    expect(getPhylumColor('UnknownPhylum')).toBe('#999999')
  })

  it('is case-sensitive', () => {
    expect(getPhylumColor('firmicutes')).toBe('#999999')
    expect(getPhylumColor('FIRMICUTES')).toBe('#999999')
  })
})