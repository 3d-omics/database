// Taxonomy colours for the composition charts, their legends and the MAG catalogue tree.
//
// Each phylum has a muted base colour (OKLCH chroma ~0.10): the charts are whole
// communities stacked to 100%, so a loud hue on a dominant phylum takes over the page.
// Classes are small hue/lightness offsets from their phylum, and orders are lighter and
// darker steps of their class, so every order still reads as its phylum. The most
// abundant order in a class keeps the class colour; the other steps are assigned so
// that orders stacked next to each other in the trial data get clearly different
// shades. Phyla that neighbour each other in the stacking order (the key order below)
// are kept far apart in hue.
export const colorScheme = {
  'Actinomycetota': { // muted raspberry
    color: '#A56088',
    class: {
      'Actinomycetia': {
        color: '#8A5284',
        order: {
          'Actinomycetales': {
            color: '#8A5284'
          },
          'Mycobacteriales': {
            color: '#9B699A'
          }
        }
      },
      'Coriobacteriia': {
        color: '#BE718B',
        order: {
          'Coriobacteriales': {
            color: '#BE718B'
          }
        }
      }
    }
  },
  //======================================
  'Bacillota': { // soft ochre
    color: '#DDB36C',
    class: {
      'Bacilli': {
        color: '#DDB36C',
        order: {
          'Acholeplasmatales': {
            color: '#D4A962'
          },
          'CAJFEE01': {
            color: '#DDB46D'
          },
          'Erysipelotrichales': {
            color: '#A37130'
          },
          'Haloplasmatales': {
            color: '#C0924E'
          },
          'Lactobacillales': {
            color: '#EFCC89'
          },
          'ML615J-28': {
            color: '#CA9D58'
          },
          'Mycoplasmatales': {
            color: '#8F5C1B'
          },
          'Paenibacillales': {
            color: '#996626'
          },
          'RF39': {
            color: '#AD7C3A'
          },
          'RFN20': {
            color: '#E6C07B'
          },
          'Staphylococcales': {
            color: '#B68744'
          }
        }
      }
    }
  },
  //======================================
  'Bacillota_A': { // calm steel blue
    color: '#5A90C8',
    class: {
      'Clostridia': {
        color: '#5A90C8',
        order: {
          'Christensenellales': {
            color: '#4877AF'
          },
          'Clostridiales': {
            color: '#3B649C'
          },
          'Eubacteriales': {
            color: '#4F81B9'
          },
          'HGM11327': {
            color: '#7CB3E2'
          },
          'Lachnospirales': {
            color: '#87BDEA'
          },
          'Monoglobales': {
            color: '#5E95CB'
          },
          'Oscillospirales': {
            color: '#416EA6'
          },
          'Peptostreptococcales': {
            color: '#689FD3'
          },
          'RUG12999': {
            color: '#91C8F1'
          },
          'TANB77': {
            color: '#9CD2F9'
          },
          'UBA1212': {
            color: '#568BC3'
          },
          'UBA1381': {
            color: '#72A9DA'
          }
        }
      }
    }
  },
  //======================================
  'Bacillota_B': { // pale lavender
    color: '#9E9BE2',
    class: {
      'Dehalobacteriia': {
        color: '#7B8ED1',
        order: {
          'UBA4068': {
            color: '#7B8ED1'
          },
          'UBA7702': {
            color: '#8EA6E3'
          }
        }
      },
      'Peptococcia': {
        color: '#C0A9F0',
        order: {
          'Peptococcales': {
            color: '#C0A9F0'
          }
        }
      }
    }
  },
  //======================================
  'Bacillota_C': { // dusty rose
    color: '#B46570',
    class: {
      'Negativicutes': {
        color: '#B46570',
        order: {
          'Acidaminococcales': {
            color: '#C77D89'
          },
          'Selenomonadales': {
            color: '#9E5158'
          },
          'Veillonellales': {
            color: '#B46570'
          }
        }
      }
    }
  },
  //======================================
  'Bacillota_G': { // pale sand
    color: '#DFCA7B',
    class: {
      'SHA-98': {
        color: '#DFCA7B',
        order: {
          'DTUO25': {
            color: '#DFCA7B'
          }
        }
      }
    }
  },
  //======================================
  'Bacteroidota': { // sage green
    color: '#77BA85',
    class: {
      'Bacteroidia': {
        color: '#77BA85',
        order: {
          'Bacteroidales': {
            color: '#77BA85'
          },
          'Cytophagales': {
            color: '#96CE9A'
          }
        }
      }
    }
  },
  //======================================
  'Bdellovibrionota': { // dusty mauve
    color: '#A2699D',
    class: {
      'UBA2361': {
        color: '#A2699D',
        order: {
          'UBA2361': {
            color: '#A2699D'
          }
        }
      }
    }
  },
  //======================================
  'Campylobacterota': { // soft straw
    color: '#E0D383',
    class: {
      'Campylobacteria': {
        color: '#E0D383',
        order: {
          'Campylobacterales': {
            color: '#E0D383'
          }
        }
      }
    }
  },
  //======================================
  'Chlamydiota': { // moss green
    color: '#6C853D',
    class: {
      'Chlamydiia': {
        color: '#6C853D',
        order: {
          'Chlamydiales': {
            color: '#6C853D'
          }
        }
      }
    }
  },
  //======================================
  'Cyanobacteriota': { // deep muted teal
    color: '#1D767D',
    class: {
      'Vampirovibrionia': {
        color: '#1D767D',
        order: {
          'Gastranaerophilales': {
            color: '#1D767D'
          }
        }
      }
    }
  },
  //======================================
  'Deferribacterota': { // pale aqua
    color: '#5FC8E0',
    class: {
      'Deferribacteres': {
        color: '#5FC8E0',
        order: {
          'Deferribacterales': {
            color: '#5FC8E0'
          }
        }
      }
    }
  },
  //======================================
  'Desulfobacterota': { // soft olive
    color: '#94984A',
    class: {
      'Desulfovibrionia': {
        color: '#94984A',
        order: {
          'Desulfovibrionales': {
            color: '#94984A'
          }
        }
      }
    }
  },
  //======================================
  'Elusimicrobiota': { // deep denim
    color: '#18719B',
    class: {
      'Elusimicrobia': {
        color: '#18719B',
        order: {
          'Elusimicrobiales': {
            color: '#18719B'
          }
        }
      }
    }
  },
  //======================================
  'Eremiobacterota': { // muted jade
    color: '#3EA083',
    class: {
      'Xenobia': {
        color: '#3EA083',
        order: {
          'Xenobiales': {
            color: '#3EA083'
          }
        }
      }
    }
  },
  //======================================
  'Fibrobacterota': { // pale periwinkle
    color: '#95AFF3',
    class: {
      'Fibrobacteria': {
        color: '#95AFF3',
        order: {
          'Fibrobacterales': {
            color: '#95AFF3'
          }
        }
      }
    }
  },
  //======================================
  'Myxococcota': { // muted indigo
    color: '#6367A9',
    class: {
      'Bradymonadia': {
        color: '#6367A9',
        order: {
          'UBA4248': {
            color: '#6367A9'
          }
        }
      }
    }
  },
  //======================================
  'Patescibacteria': { // soft sky
    color: '#57B9D9',
    class: {
      'Saccharimonadia': {
        color: '#57B9D9',
        order: {
          'Saccharimonadales': {
            color: '#57B9D9'
          }
        }
      }
    }
  },
  //======================================
  'Planctomycetota': { // soft orchid
    color: '#BF90CE',
    class: {
      'Planctomycetia': {
        color: '#BF90CE',
        order: {
          'Pirellulales': {
            color: '#BF90CE'
          }
        }
      }
    }
  },
  //======================================
  'Pseudomonadota': { // muted clay
    color: '#AF6F41',
    class: {
      'Alphaproteobacteria': {
        color: '#A0593E',
        order: {
          'RF32': {
            color: '#934D35'
          },
          'Rickettsiales': {
            color: '#CC9374'
          },
          'Rs-D84': {
            color: '#A86347'
          },
          'UBA3830': {
            color: '#BA7A5D'
          }
        }
      },
      'Gammaproteobacteria': {
        color: '#BB8648',
        order: {
          'Burkholderiales': {
            color: '#CC9E64'
          },
          'Enterobacterales': {
            color: '#A67035'
          },
          'Enterobacterales_A': {
            color: '#BB8648'
          }
        }
      }
    }
  },
  //======================================
  'Spirochaetota': { // soft lavender
    color: '#A392D7',
    class: {
      'Brachyspirae': {
        color: '#8184C9',
        order: {
          'Brachyspirales': {
            color: '#8184C9'
          }
        }
      },
      'Spirochaetia': {
        color: '#C49FE3',
        order: {
          'Sphaerochaetales': {
            color: '#D6B8F8'
          },
          'Treponematales': {
            color: '#C49FE3'
          }
        }
      }
    }
  },
  //======================================
  'Thermoplasmatota': { // neutral slate
    color: '#6F757D',
    class: {
      'Thermoplasmata': {
        color: '#6F757D',
        order: {
          'Methanomassiliicoccales': {
            color: '#6F757D'
          }
        }
      }
    }
  },
  //======================================
  'Verrucomicrobiota': { // deep wine
    color: '#813E60',
    class: {
      'Kiritimatiellia': {
        color: '#682F5C',
        order: {
          'RFP12': {
            color: '#682F5C'
          }
        }
      },
      'Lentisphaeria': {
        color: '#813E60',
        order: {
          'UBA1407': {
            color: '#8B4B6D'
          },
          'Victivallales': {
            color: '#9D6284'
          }
        }
      },
      'Verrucomicrobiae': {
        color: '#994E62',
        order: {
          'Opitutales': {
            color: '#AB657A'
          },
          'Verrucomicrobiales': {
            color: '#994E62'
          }
        }
      }
    }
  }
};
