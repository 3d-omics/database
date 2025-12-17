export const getExperimentOptions = (experimentId: string): Record<string, Record<string, string>> => {
  switch (experimentId) {
    case 'G':
      return {
        'Day': {
          '7': 'Day 7',
          '14': 'Day 14',
          '21': 'Day 21',
          '28': 'Day 28',
          '35': 'Day 35'
        },
        'Treatment': {
          'T1': 'YES pathogen, YES PoultryStar® in drinking water and feed',
          'T2': 'YES pathogen, YES PoultryStar® in drinking water',
          'T3': 'YES pathogen, YES PoultryStar® in feed',
          'T4': 'YES pathogen, NO PoultryStar®',
          'T5': 'NO pathogen, NO PoultryStar®'
        }
      }

    case 'H':
      return {
        'Day': {
          'a': 'a',
          'b': 'b',
          'c': 'c',
          'd': 'd',
          'e': 'e'
        },
        'Treatment': {
          'TH1': 'Vaccinated + Challenge (Formulation 1)',
          'TH2': 'Vaccinated + Challenge (Formulation 2)',
          'TH3': 'Non-vaccinated + Challenge (Positive control)',
          'TH4': 'Non-vaccinated + No challenge (Negative control)',
        },
        'DPI': {
          '0': '0',
          '4': '4',
          '7': '7',
          '14': '14',
          '21': '21'
        },
        'Sample type': {
          'Tissue': 'Tissue',
          'Digesta': 'Digesta'
        }
      }

    case 'I':
      return {
        'Diet': {
          '1': 'High protein diet',
          '3': 'Low protein diet',
        },
        'Group': {
          'LEBV': 'LEBV',
          'HEBV': 'HEBV'
        },
        'Sample type': {
          'Tissue': 'Tissue',
          'Digesta': 'Digesta'
        }
      }

    case 'J':
      return {
        'Diet': {
          'T1': 'Control diet + no mannan',
          'T2': 'Mannan'
        },
        'Sample type': {
          'Tissue': 'Tissue',
          'Digesta': 'Digesta'
        }
      }

    case 'K':
      return {
        'Diet': {
          '1': 'High protein diet',
          '3': 'Low protein diet',
        },
        'Group': {
          'LEBV': 'LEBV',
          'HEBV': 'HEBV'
        },
        'Sample type': {
          'Tissue': 'Tissue',
          'Digesta': 'Digesta'
        }
      }

    case 'M':
      return {
        'Day': {
          'a': 'a',
          'b': 'b',
          'c': 'c',
          'd': 'd',
        },
        'Treatment': {
          'TM1': 'Vaccinated + Challenge (Formulation 1)',
          'TM2': 'Vaccinated + Challenge (Formulation 2)',
          'TM3': 'Non-vaccinated + Challenge (Positive control)',
          'TM4': 'Non-vaccinated + No challenge (Negative control)',
        },
        'DPI': {
          '0': '0',
          '7': '7',
          '9': '9',
          '14': '14',
          '21': '21'
        },
        'Sample type': {
          'Tissue': 'Tissue',
          'Digesta': 'Digesta'
        }
      }


    default:
      return {}
  }
}
