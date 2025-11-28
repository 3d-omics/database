export const menus = [
  { location: '/', title: 'Data Portal Home' },
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
  {
    sectionTitle: 'Microsamples',
    subMenus: [
      { location: '/microsamples', title: 'Microsamples' },
      { location: '/microsample-compositions', title: 'Metagenomics' },
    ]
  }
]
