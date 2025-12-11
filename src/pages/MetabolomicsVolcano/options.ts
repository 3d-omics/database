export const getExperimentOptions = (experimentId: string): Record<string, Record<string, string>> => {
  switch (experimentId) {
    case 'G':
      return {
        'DAY': {
          '7': 'Day 7',
          '14': 'Day 14',
          '21': 'Day 21',
          '28': 'Day 28',
          '35': 'Day 35'
        },
        'TREATMENT': {
          'T1': 'YES pathogen, YES PoultryStar® in drinking water and feed',
          'T2': 'YES pathogen, YES PoultryStar® in drinking water',
          'T3': 'YES pathogen, YES PoultryStar® in feed',
          'T4': 'YES pathogen, NO PoultryStar®',
          'T5': 'NO pathogen, NO PoultryStar®'
        }
      }

    case 'H':
      return {
        'DAY': {
          'a': 'Day 0',
          'b': 'Day 4',
          'c': 'Day 7',
          'd': 'Day 14',
          'e': 'Day 21'
        },
        'TREATMENT': {
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
        'DIET': {
          '1': 'High protein diet',
          '3': 'Low protein diet',
        },
        'GROUP': {
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
        'DIET': {
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
        'DIET': {
          '1': 'High protein diet',
          '3': 'Low protein diet',
        },
        'GROUP': {
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
        'DAY': {
          'a': '0',
          'b': '7',
          'c': '9/14',
          'd': '21',
        },
        'TREATMENT': {
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
