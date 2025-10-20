import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Details from './components/Details'
import SamplesContainingThisGenome from './components/SamplesContainingThisGenome'
import Tabs from 'components/Tabs'
import type { GenomeData } from 'pages/GenomeCatalogue/components/Table'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import ErrorBanner from 'components/ErrorBanner'
import BreadCrumbs from 'components/BreadCrumbs'
import NotFound from 'pages/NotFound'
import Loading from 'components/Loading'


const Genome = () => {
  const [selectedTab, setSelectedTab] = useState('Genome details')
  const [genomeData, setGenomeData] = useState<GenomeData | null>(null)
  const [loading, setLoading] = useState(true)

  const { genomeName = '', experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const csvFiles = import.meta.glob('../../assets/data/genome_metadata/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  });
  const csvUrl = csvFiles[`../../assets/data/genome_metadata/experiment_${experimentId}_metadata.csv`];
  const { fetchExcel, fetchExcelError } = useFetchExcelFileData({ excelFile: csvUrl })


  useEffect(() => {
    setLoading(true)
    Promise.all([fetchExcel()]).then(([meta]) => {
      if (meta && genomeName) {
        const idx = meta.genome.findIndex((g: string) => g === genomeName)
        if (idx !== -1) {
          const genomeDataForIndex: Partial<GenomeData> = {}
          Object.keys(meta).forEach((key) => {
            let value = meta[key][idx]
            if (
              ['phylum', 'domain', 'class', 'order', 'family', 'genus', 'species'].includes(key)
              && typeof value === 'string'
            ) {
              if (value.length <= 3) {
                value = 'unknown'
              } else {
                value = value.slice(3)
              }
            }
            genomeDataForIndex[key as keyof GenomeData] = value
          })
          setGenomeData(genomeDataForIndex as GenomeData)
        } else {
          setGenomeData(null)
        }
      } else {
        setGenomeData(null)
      }
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return null
    // return <Loading />
  }

  if (genomeData === null) {
    return <NotFound />
  }

  return (
    <div className='page_padding pt-7 min-h-screen'>

      <BreadCrumbs
        items={[
          { label: 'Home', link: '/' },
          { label: 'Genome Catalogues', link: '/genome-catalogues' },
          { label: experimentName, link: `/genome-catalogues/${encodeURIComponent(experimentName)}` },
          { label: genomeName }
        ]}
      />

      <header className='main_header max-sm:mb-1.5 pb-7'>{genomeName}</header>

      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={['Genome details', 'Samples containing this genome']}
      />

      <div className='h-6'></div>

      {fetchExcelError && <ErrorBanner>{fetchExcelError}</ErrorBanner>}
      {genomeData &&
        <main>
          {selectedTab === 'Genome details' && <Details genomeData={genomeData} />}
          {selectedTab === 'Samples containing this genome' && <SamplesContainingThisGenome genomeName={genomeName} />}
        </main>
      }
    </div>
  )
}

export default Genome