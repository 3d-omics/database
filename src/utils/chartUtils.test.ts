import { describe, it, expect } from 'vitest'
import { flattenedcolorScheme } from './chartUtils'

describe('flattenedcolorScheme', () => {
  it('flattens nested color scheme correctly', () => {
    const colorScheme = {
      Bacteria: {
        color: '#FF0000',
        class: {
          Bacilli: { color: '#00FF00' },
          Clostridia: { color: '#0000FF' },
        },
      },
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).toEqual({
      Bacteria: '#FF0000',
      Bacilli: '#00FF00',
      Clostridia: '#0000FF',
    })
  })

  it('skips keys named "color"', () => {
    const colorScheme = {
      Bacteria: { color: '#FF0000' },
      color: '#AAAAAA', // Should be skipped
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).not.toHaveProperty('color')
    expect(result).toHaveProperty('Bacteria')
  })

  it('handles empty object', () => {
    const result = flattenedcolorScheme({})
    expect(result).toEqual({})
  })

  it('ignores items without color property', () => {
    const colorScheme = {
      Bacteria: { color: '#FF0000' },
      NoColor: { otherProperty: 'value' },
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).toEqual({
      Bacteria: '#FF0000',
    })
  })
})