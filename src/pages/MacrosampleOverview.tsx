import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import SummaryStrip from 'components/SummaryStrip'
import EnaRunMetadata from 'components/EnaRunMetadata'
import SampleTaxonomyOverview from 'components/SampleTaxonomyOverview'
import { TrailMark } from 'components/BreadCrumbs'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
import useSampleIdentifiers, { MacrosampleIdentifiers } from 'hooks/useSampleIdentifiers'
import specimenData from 'assets/data/airtable/animalspecimen.json'
import trialData from 'assets/data/airtable/animaltrialexperiment.json'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import microsampleData from 'assets/data/airtable/microsample.json'
import macroSequencingData from 'assets/data/airtable/macrosample.json'
import { hasRelatedRecords } from 'utils/hasRelatedRecords'
import CryosectionTab from 'components/TabComponents/CryosectionTab'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import Tabs from 'components/Tabs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'

const MacrosampleOverview = () => {

  const { macrosampleName = '' } = useParams()
  const [selectedTab, setSelectedTab] = useState('Cryosections')

  // Validate that the macrosample exists
  const { validating, notFound } = useValidateParams({
    tableType: 'macrosample',
    filterId: 'ID',
    filterValue: macrosampleName
  })

  // Filter data to find the specific macrosample
  const data = useMemo(() => {
    return (macrosampleData).filter((record) => {
      const name = record.fields.ID
      return name && String(name).toLowerCase() === macrosampleName.toLowerCase()
    })
  }, [macrosampleName])

  const macrosample = data[0]
  const tabs = useMemo(() => {
    const id = macrosample?.fields.ID
    if (!id) return []

    return [
      hasRelatedRecords(cryosectionData, 'ID', id) && 'Cryosections',
      hasRelatedRecords(microsampleData, 'Code', id) && 'Microsamples',
    ].filter((tab): tab is string => Boolean(tab))
  }, [macrosample?.fields.ID])
  const activeTab = tabs.includes(selectedTab) ? selectedTab : tabs[0]
  const specimen = specimenData.find((record) => record.fields.ID === macrosample?.fields.Individual)
  // The first character of a macrosample ID identifies its experiment, including
  // the few records whose parent specimen is absent from the catalogue.
  const experiment = specimen?.fields.Experiment_flat ?? macrosample?.fields.ID.charAt(0)
  const trial = trialData.find((record) => record.fields.ID === experiment)
  const enaAccessions = macrosample?.fields['ENA accession'] ?? []
  const biosampleAccession = (macrosample?.fields as { 'BioSamples accession'?: string } | undefined)?.['BioSamples accession']
  const identifiers = useSampleIdentifiers<MacrosampleIdentifiers>('macro', Boolean(biosampleAccession))
  const materialInsdc = identifiers[macrosampleName]?.material_insdc_sample_accessions ?? []
  const enaAccession = enaAccessions.join(', ')
  const countSampleId = macroSequencingData.find((record) =>
    record.fields.run_accession && enaAccessions.includes(record.fields.run_accession)
  )?.fields.ID

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {macrosample && (
          <>
            <PageHeader
              title={macrosampleName}
              breadcrumbs={[
                { label: 'Data Portal Home', link: '/' },
                { label: 'Macrosamples', link: '/macrosamples' },
                { label: macrosampleName }
              ]}
              aside={enaAccession &&
                <dl className='grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 rounded-md bg-black/20 px-3 py-1.5 text-sm text-neutral-50/85 backdrop-blur-sm [&_dt]:flex [&_dt]:items-center [&_dt]:gap-2 [&_a]:font-bold [&_a]:transition-colors hover:[&_a]:text-light_mustard'>
                  <dt><TrailMark />ENA accession:</dt>
                  <dd>
                    {macrosample.fields['ENA link']
                      ? <Link to={macrosample.fields['ENA link']} target='_blank' rel='noopener noreferrer'>
                        {enaAccession}
                      </Link>
                      : enaAccession}
                  </dd>
                </dl>
              }
            />

            <SummaryStrip
              label='Macrosample summary'
              stats={[
                { label: 'Trial', value: experiment, to: trial && `/animal-trials/${encodeURIComponent(trial.fields.Name)}`, title: trial?.fields.Name },
                { label: 'Sample type', value: macrosample.fields['Sample type'] },
                { label: 'Destination', value: macrosample.fields['Data type'] },
                { label: 'Preservation', value: macrosample.fields.Preservative },
              ]}
            />

            <main>
              <div className='page_padding grid gap-x-10 gap-y-9 pt-9 pb-3 xl:grid-cols-2 xl:[&>section:only-child]:col-span-2'>
                {biosampleAccession && <section aria-label='Material BioSample'>
                  <h2 className='main_header text-2xl text-ink'>Material BioSample</h2>
                  <a href={`https://www.ebi.ac.uk/biosamples/samples/${encodeURIComponent(biosampleAccession)}`} target='_blank' rel='noopener noreferrer' className='link mt-5 inline-block font-jakarta text-lg font-semibold'>{biosampleAccession}</a>
                  {materialInsdc.length > 0 && <p className='mt-2 text-sm text-ink_muted'>INSDC sample: {materialInsdc.map((accession) => <a key={accession} href={`https://www.ebi.ac.uk/ena/browser/view/${encodeURIComponent(accession)}`} target='_blank' rel='noopener noreferrer' className='link ml-1'>{accession}</a>)}</p>}
                </section>}
                {enaAccessions.length > 0
                  ? <EnaRunMetadata accessions={enaAccessions} />
                  : <section>
                    <h2 id='sample-details-heading' className='main_header text-2xl text-ink'>Sample details</h2>
                    <dl className='mt-5 grid max-w-5xl gap-4 sm:grid-cols-3'>
                      <div className='rounded-xl border border-line bg-surface_subtle px-5 py-4'>
                        <dt className='text-sm text-ink_muted'>Animal specimen</dt>
                        <dd className='mt-1 font-jakarta text-lg font-semibold text-burgundy_ink'>
                          {specimen
                            ? <Link to={`/animal-specimens/${encodeURIComponent(specimen.fields.ID)}`} className='link'>{specimen.fields.ID}</Link>
                            : macrosample.fields.Individual ?? '—'}
                        </dd>
                      </div>
                      <div className='rounded-xl border border-line bg-surface_subtle px-5 py-4'>
                        <dt className='text-sm text-ink_muted'>Material</dt>
                        <dd className='mt-1 font-jakarta text-lg font-semibold text-ink'>{macrosample.fields.Description ?? '—'}</dd>
                      </div>
                      <div className='rounded-xl border border-line bg-surface_subtle px-5 py-4'>
                        <dt className='text-sm text-ink_muted'>Container</dt>
                        <dd className='mt-1 font-jakarta text-lg font-semibold text-ink'>{macrosample.fields.Container ?? '—'}</dd>
                      </div>
                    </dl>
                  </section>}
                {countSampleId && <SampleTaxonomyOverview kind='macro' experimentId={experiment ?? ''} sampleId={countSampleId} />}
              </div>

              {tabs.length > 0 && <>
                <section className='page_padding pt-8 pb-2'>
                  <Tabs
                    selectedTab={activeTab}
                    setSelectedTab={setSelectedTab}
                    tabs={tabs}
                  />
                </section>
                <section id='related-data-panel' role='tabpanel' aria-label={activeTab} tabIndex={0} className='pt-4'>
                  {activeTab === 'Cryosections' && <CryosectionTab id={macrosample.fields.ID} />}
                  {activeTab === 'Microsamples' && <MicrosampleTab id={macrosample.fields.ID} />}
                </section>
              </>}
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default MacrosampleOverview
