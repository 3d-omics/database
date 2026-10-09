import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Tabs from 'components/Tabs'
import type { GenomeData } from 'pages/MAGCatalogue/components/Table'
import PageHeader from 'components/PageHeader'
import ErrorBanner from 'components/ErrorBanner'
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
import biologicalMacrosamples from 'assets/data/airtable/intestinalsectionsample.json'
import biologicalMicrosamples from 'assets/data/airtable/microsample.json'

const microsamplesWithCoordinationData = microsamplesWithCoordinationDataImport as any[]
const macroIdByRun = new Map(biologicalMacrosamples.flatMap(record =>
  (record.fields['ENA accession'] ?? []).map((accession: string) => [accession, record.fields.ID] as const)
))
const microCodeByRun = new Map(biologicalMicrosamples.flatMap(record =>
  (record.fields['ENA accession'] ?? []).map((accession: string) => [accession, record.fields.Code] as const)
))

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
        enaLink: airtabledata?.fields['ENA link'] || '',
        macrosampleId: macroIdByRun.get(airtabledata?.fields.run_accession || '') || '',
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
        microsampleCode: microCodeByRun.get(airtabledata?.fields.run_accession || '') || '',
      }
    })
  }, [microsampleIds])

  // Check for errors (data not loaded)
  const macroError = !macroCounts ? 'Failed to load macrosample data' : null
  const microError = allMicrosampleCounts.length === 0 ? 'Failed to load microsample data' : null
  const tabs = [
    macrosampleIdsWithENALink.length > 0 && 'Macrosamples',
    microsampleIdsWithENALink.length > 0 && 'Microsamples',
  ].filter((tab): tab is string => Boolean(tab))
  const activeTab = tabs.includes(selectedTab) ? selectedTab : tabs[0]
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

        <div className='page_padding pt-8'>
          {macroError && <ErrorBanner>{macroError}</ErrorBanner>}
          {microError && <ErrorBanner>{microError}</ErrorBanner>}
          {tabs.length > 0 && <Tabs
            selectedTab={activeTab}
            setSelectedTab={setSelectedTab}
            tabs={tabs}
          />}
          {tabs.length === 0 && !macroError && !microError &&
            <p className='text-ink_muted'>No sample abundance data are available for this genome.</p>}
          {activeTab && <div id='related-data-panel' role='tabpanel' aria-label={activeTab} tabIndex={0} className='pt-6'>
            {activeTab === 'Macrosamples' && (
              <MacrosampleTab
                data={macrosampleIdsWithENALink}
                genomeName={genomeName}
                isLoading={false}
                error={null}
              />
            )}
            {activeTab === 'Microsamples' && (
              <MicrosampleTab
                data={microsampleIdsWithENALink}
                genomeName={genomeName}
                isLoading={false}
                error={null}
              />
            )}
          </div>}
        </div>
      </div>
    </ParamsValidator>
  )
}

export default Genome
