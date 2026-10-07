import { describe, expect, it } from 'vitest'
import { searchEntries, type SearchEntry } from './searchIndex'

const entry = (title: string, category: string, keywords = ''): SearchEntry => ({
  title, category, keywords, subtitle: '', url: `/${title}`,
})

describe('searchEntries', () => {
  const records = [
    entry('G123eI101A', 'Microsample', 'ERR123456'),
    entry('G123', 'Animal specimen'),
    entry('Coproplasma avistercoris', 'MAG', 'Bacillota_A Coproplasma'),
    entry('Metabolomics', 'Page'),
  ]

  it('ranks an exact identifier before a longer matching identifier', () => {
    expect(searchEntries(records, 'g123').map((result) => result.title))
      .toEqual(['G123', 'G123eI101A'])
  })

  it('finds accessions and taxonomy without case or punctuation sensitivity', () => {
    expect(searchEntries(records, 'err-123456')[0]?.title).toBe('G123eI101A')
    expect(searchEntries(records, 'bacillota a')[0]?.category).toBe('MAG')
  })

  it('returns no results for an empty query or unmatched terms', () => {
    expect(searchEntries(records, '  ')).toEqual([])
    expect(searchEntries(records, 'missing')).toEqual([])
  })
})
