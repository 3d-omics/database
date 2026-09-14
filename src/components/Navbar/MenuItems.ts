export const menus = [
  { location: '/animal-trials', title: 'Animal Trials' },
  { location: '/mag-catalogues', title: 'MAG Catalogues' },
  { location: '/animal-specimens', title: 'Animal Specimens' },
  {
    sectionTitle: 'Macrosamples',
    subMenus: [
      { location: '/macrosamples', title: 'Macrosamples' },
      { location: '/macrosample-compositions', title: 'Metagenomics' },
      { location: '/metabolomics', title: 'Metabolomics' },
    ]
  },
  { location: '/cryosections', title: 'Cryosections' },
  { location: '/microsamples', title: 'Microsamples' },
  {
    sectionTitle: 'Methods',
    subMenus: [
      { location: '/methods/mag-catalogue', title: 'MAG Catalogue' },
      { location: '/methods/macro-metagenomics', title: 'Macro Metagenomics' },
      { location: '/methods/micro-metagenomics', title: 'Micro Metagenomics' },
      { location: '/methods/metabolomics', title: 'Metabolomics' },
    ]
  },
]
