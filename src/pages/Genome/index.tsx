import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Tabs from 'components/Tabs'
import type { GenomeData } from 'pages/MAGCatalogue/components/Table'
import PageHeader from 'components/PageHeader'
import NotFound from 'pages/NotFound'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import MacrosampleTab from './components/MacrosampleTab'
import MicrosampleTab from './components/MicrosampleTab'
import { useGenomeJsonFile, useAllMicrosampleCounts } from 'hooks/useJsonData'
import { processCounts } from './utils/genomeUtils'
import type { SampleData } from './utils/genomeUtils'
import macrosampleData from 'assets/data/airtable/macrosample.json'
import microsamplesWithCoordinationDataImport from 'assets/data/airtable/microsampleswithcoordination.json'

const microsamplesWithCoordinationData = microsamplesWithCoordinationDataImport as any[]

const Genome = () => {
  const [selectedTab, setSelectedTab] = useState('Macrosamples')
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

  // ============ For SamplesContainingThisGenome part ============
  // Load ONLY the macro genome counts for this specific experiment
  const macroCounts = useGenomeJsonFile(
    'macro_genome_counts',
    `experiment_${experimentId}_counts`
  )

  // Load all microsample counts (all 83 files)
  const allMicrosampleCounts = useAllMicrosampleCounts()

  // Process macrosample data (single file for this experiment)
  const macrosampleIds = useMemo(() => {
    return processCounts(macroCounts, genomeName)
  }, [macroCounts, genomeName])

  // Get macrosample data with ENA link from airtable data
  const macrosampleIdsWithENALink = useMemo(() => {
    return macrosampleIds.map(item => {
      const airtabledata = macrosampleData.find(
        (sample: any) => sample.fields.ID === item.id
      )
      return {
        ...item,
        experimentalUnitIndexedLibrary: airtabledata?.fields.ExperimentalUnitIndexedLibrary[0] || '',
        run_accession: airtabledata?.fields.run_accession || '',
        enaLink: airtabledata?.fields['ENA link'] || ''
      }
    })
  }, [macrosampleIds])

  // Process microsample data (aggregate from ALL 83 files)
  const microsampleIds = useMemo(() => {
    const allMicrosampleIds: SampleData = []

    // Go through all microsample count files
    allMicrosampleCounts.forEach(({ data }) => {
      const processed = processCounts(data, genomeName)
      allMicrosampleIds.push(...processed)
    })

    return allMicrosampleIds
  }, [allMicrosampleCounts, genomeName])

  // Get microsample data with ENA link from airtable data
  const microsampleIdsWithENALink = useMemo(() => {
    return microsampleIds.map(item => {
      const airtabledata = microsamplesWithCoordinationData.find(
        (sample: any) => sample.fields.ID === item.id
      )
      return {
        ...item,
        run_accession: airtabledata?.fields.run_accession || '',
        enaLink: airtabledata?.fields['ENA link'] || '',
      }
    })
  }, [microsampleIds])

  // Check for errors (data not loaded)
  const macroError = !macroCounts ? 'Failed to load macrosample data' : null
  const microError = allMicrosampleCounts.length === 0 ? 'Failed to load microsample data' : null
  // ============================================================

  if (!genomeMetadata) {
    return <NotFound />
  }

  if (genomeData === null) {
    return <NotFound />
  }

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        <PageHeader
          title={genomeName}
          breadcrumbs={[
            { label: 'Data Portal Home', link: '/' },
            { label: 'MAG Catalogues', link: '/mag-catalogues' },
            { label: experimentName, link: `/mag-catalogues/${encodeURIComponent(experimentName)}` },
            { label: genomeName }
          ]}
        >
          <div className='flex [&>span]:flex [&>span]:gap-1'>
            <span className='flex-wrap [&>span]:font-light'>
              Taxonomic lineage:&nbsp;
              <span>{genomeData.domain}</span>
              <span>&nbsp;&gt;&nbsp;</span>
              <span>{genomeData.phylum}</span>
              <span>&nbsp;&gt;&nbsp;</span>
              <span>{genomeData.class}</span>
              <span>&nbsp;&gt;&nbsp;</span>
              <span>{genomeData.order}</span>
              <span>&nbsp;&gt;&nbsp;</span>
              <span>{genomeData.family}</span>
              <span>&nbsp;&gt;&nbsp;</span>
              <span>{genomeData.genus}</span>
              <span>&nbsp;&gt;&nbsp;</span>
              <span>{genomeData.species}</span>
            </span>
          </div>

          <div className='flex flex-wrap gap-x-4 gap-y-0.5 [&>span]:flex [&>span]:gap-1 max-lg:flex-col'>
            <span>
              Completeness:&nbsp;
              <b>{genomeData.completeness}%</b>
            </span>
            <span>
              Contamination:&nbsp;
              <b>{genomeData.contamination}%</b>
            </span>
            <span>
              Length:&nbsp;
              <b>{genomeData.length}</b>
            </span>
          </div>
        </PageHeader>

        <div className='page_padding'>
          <Tabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabs={['Macrosamples', 'Microsamples']}
          />
          <div className='h-6'></div>
          {selectedTab === 'Macrosamples' && (
            <MacrosampleTab
              data={macrosampleIdsWithENALink}
              genomeName={genomeName}
              isLoading={false}
              error={macroError}
            />
          )}
          {selectedTab === 'Microsamples' && (
            <MicrosampleTab
              data={microsampleIdsWithENALink}
              genomeName={genomeName}
              isLoading={false}
              error={microError}
            />
          )}
        </div>
      </div>
    </ParamsValidator>
  )
}

export default Genome

