import { flattenedcolorScheme } from './chartUtils'

describe('flattenedcolorScheme', () => {
  it('flattens nested color scheme', () => {
    const colorScheme = {
      'Proteobacteria': {
        color: '#FF0000',
        class: {
          'Gammaproteobacteria': {
            color: '#FF5555',
          },
        },
      },
      'Firmicutes': {
        color: '#00FF00',
      },
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).toEqual({
      'Proteobacteria': '#FF0000',
      'Gammaproteobacteria': '#FF5555',
      'Firmicutes': '#00FF00',
    })
  })

  it('handles deeply nested taxonomic levels', () => {
    const colorScheme = {
      'Phylum': {
        color: '#111111',
        class: {
          'Class': {
            color: '#222222',
            order: {
              'Order': {
                color: '#333333',
                family: {
                  'Family': {
                    color: '#444444',
                    genus: {
                      'Genus': {
                        color: '#555555',
                        species: {
                          'Species': {
                            color: '#666666',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).toEqual({
      'Phylum': '#111111',
      'Class': '#222222',
      'Order': '#333333',
      'Family': '#444444',
      'Genus': '#555555',
      'Species': '#666666',
    })
  })

  it('skips entries without color property', () => {
    const colorScheme = {
      'WithColor': {
        color: '#FF0000',
      },
      'WithoutColor': {
        someOtherProp: 'value',
      },
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).toEqual({
      'WithColor': '#FF0000',
    })
  })

  it('returns empty object for empty input', () => {
    const result = flattenedcolorScheme({})
    expect(result).toEqual({})
  })

  it('handles multiple taxa at same level', () => {
    const colorScheme = {
      'Taxa1': { color: '#111111' },
      'Taxa2': { color: '#222222' },
      'Taxa3': { color: '#333333' },
    }

    const result = flattenedcolorScheme(colorScheme)

    expect(result).toEqual({
      'Taxa1': '#111111',
      'Taxa2': '#222222',
      'Taxa3': '#333333',
    })
  })

  it('handles primitive values gracefully', () => {
    const colorScheme = {
      'WithColor': { color: '#FF0000' },
      'StringValue': 'just a string',
      'NumberValue': 42,
    }

    const result = flattenedcolorScheme(colorScheme)

    // Should only extract the one with color
    expect(result).toEqual({
      'WithColor': '#FF0000',
    })
  })
})