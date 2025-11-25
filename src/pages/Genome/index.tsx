import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Details from './components/Details'
import SamplesContainingThisGenome from './components/SamplesContainingThisGenome'
import Tabs from 'components/Tabs'
import type { GenomeData } from 'pages/GenomeCatalogue/components/Table'
import BreadCrumbs from 'components/BreadCrumbs'
import NotFound from 'pages/NotFound'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import { useGenomeJsonFile } from 'hooks/useJsonData'

const Genome = () => {
  const [selectedTab, setSelectedTab] = useState('Genome details')
  const { genomeName = '', experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const { validating, notFound } = useValidateParams({
    tableType: 'animalTrialExperiment',
    filterId: 'Name',
    filterValue: experimentName
  })

  // Load genome metadata using the helper hook
  const genomeMetadata = useGenomeJsonFile(
    'genome_metadata',
    `experiment_${experimentId}_metadata`
  )

  // Extract specific genome data
  const genomeData = useMemo(() => {
    if (!genomeMetadata || !genomeName) return null

    const idx = genomeMetadata.genome?.findIndex((g: string) => g === genomeName)
    
    if (idx === -1 || idx === undefined) return null

    const data: Partial<GenomeData> = {}
    
    Object.keys(genomeMetadata).forEach((key) => {
      let value = genomeMetadata[key][idx]
      
      // Clean taxonomy fields
      if (
        ['phylum', 'domain', 'class', 'order', 'family', 'genus', 'species'].includes(key) &&
        typeof value === 'string'
      ) {
        if (value.length <= 3) {
          value = 'unknown'
        } else {
          value = value.slice(3)
        }
      }
      
      data[key as keyof GenomeData] = value
    })

    return data as GenomeData
  }, [genomeMetadata, genomeName])

  if (!genomeMetadata) {
    return <NotFound />
  }

  if (genomeData === null) {
    return <NotFound />
  }

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='page_padding pt-7 min-h-screen'>
        <BreadCrumbs
          items={[
            { label: 'Home', link: '/' },
            { label: 'MAG Catalogues', link: '/mag-catalogues' },
            { label: experimentName, link: `/mag-catalogues/${encodeURIComponent(experimentName)}` },
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

        <main>
          {selectedTab === 'Genome details' && <Details genomeData={genomeData} />}
          {selectedTab === 'Samples containing this genome' && (
            <SamplesContainingThisGenome genomeName={genomeName} />
          )}
        </main>
      </div>
    </ParamsValidator>
  )
}

export default Genome


