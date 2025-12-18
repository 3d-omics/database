import { describe, it, expect } from 'vitest'
import { getExperimentOptions } from './options'

describe('getExperimentOptions', () => {
  it('returns correct options for experiment G', () => {
    const options = getExperimentOptions('G')

    expect(options).toHaveProperty('Day')
    expect(options).toHaveProperty('Treatment')
    expect(options.Day).toHaveProperty('7', 'Day 7')
    expect(options.Treatment).toHaveProperty('T1')
  })

  it('returns correct options for experiment H', () => {
    const options = getExperimentOptions('H')

    expect(options).toHaveProperty('Day')
    expect(options).toHaveProperty('Treatment')
    expect(options).toHaveProperty('DPI')
    expect(options).toHaveProperty('Sample type')
    expect(options.Treatment).toHaveProperty('TH1')
  })

  it('returns correct options for experiment I', () => {
    const options = getExperimentOptions('I')

    expect(options).toHaveProperty('Diet')
    expect(options).toHaveProperty('Group')
    expect(options).toHaveProperty('Sample type')
    expect(options.Diet).toHaveProperty('1', 'High protein diet')
  })

  it('returns correct options for experiment J', () => {
    const options = getExperimentOptions('J')

    expect(options).toHaveProperty('Diet')
    expect(options).toHaveProperty('Sample type')
    expect(options.Diet).toHaveProperty('T1', 'Control diet + no mannan')
  })

  it('returns correct options for experiment K', () => {
    const options = getExperimentOptions('K')

    expect(options).toHaveProperty('Diet')
    expect(options).toHaveProperty('Group')
    expect(options).toHaveProperty('Sample type')
    expect(options.Diet).toHaveProperty('3', 'Low protein diet')
  })

  it('returns correct options for experiment M', () => {
    const options = getExperimentOptions('M')

    expect(options).toHaveProperty('Day')
    expect(options).toHaveProperty('Treatment')
    expect(options).toHaveProperty('DPI')
    expect(options).toHaveProperty('Sample type')
    expect(options.Treatment).toHaveProperty('TM1')
  })

  it('returns empty object for unknown experiment', () => {
    const options = getExperimentOptions('Z')
    expect(options).toEqual({})
  })

  it('returns empty object for empty string', () => {
    const options = getExperimentOptions('')
    expect(options).toEqual({})
  })

  it('returns nested structure for all valid experiments', () => {
    const experimentIds = ['G', 'H', 'I', 'J', 'K', 'M']

    experimentIds.forEach(id => {
      const options = getExperimentOptions(id)
      
      // Should return an object
      expect(typeof options).toBe('object')
      
      // Should have at least one key
      expect(Object.keys(options).length).toBeGreaterThan(0)
      
      // Each value should be an object
      Object.values(options).forEach(value => {
        expect(typeof value).toBe('object')
      })
    })
  })
})