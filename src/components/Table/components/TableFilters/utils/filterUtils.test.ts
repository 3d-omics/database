import { describe, expect } from 'vitest'
import { formatIdForDisplay, deleteFilter } from './filterUtils'


describe('components > Table > utils > formatIdForDisplay', () => {
  it('should return ID unchanged', () => {
    expect(formatIdForDisplay('ID')).toBe('ID')
  })

  it('should formats known cases', () => {
    expect(formatIdForDisplay('LMBatch_flat')).toBe('LMBatch')
    expect(formatIdForDisplay('Individual')).toBe('Experimental Unit Series')
    expect(formatIdForDisplay('Metabolite')).toBe('Metabolite Data')
  })

  it('should removes _flat for other IDs', () => {
    expect(formatIdForDisplay('Example_flat')).toBe('Example')
  })

  it('should add spaces before capitals', () => {
    expect(formatIdForDisplay('SomeLongID')).toBe('Some Long I D')
  })

  it('should trim spaces', () => {
    expect(formatIdForDisplay('AnotherTest')).toBe('Another Test')
  })
})



describe('components > Table > utils > deleteFilter', () => {
  it('should removes filter at index', () => {
    const filters = [{ id: 'a', value: 1 }, { id: 'b', value: 2 }]
    const result = deleteFilter(0, filters)
    expect(result).toEqual([{ id: 'b', value: 2 }])
  })

  it('should not mutate original', () => {
    const filters = [{ id: 'a', value: 1 }, { id: 'b', value: 2 }]
    const _ = deleteFilter(0, filters)
    expect(filters).toHaveLength(2)
  })

  it('should work with empty array', () => {
    expect(deleteFilter(0, [])).toEqual([])
  })
})
