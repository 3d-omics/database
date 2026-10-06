import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import SummaryStrip from 'components/SummaryStrip'
import { TrailMark } from 'components/BreadCrumbs'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'
import trialData from 'assets/data/airtable/animaltrialexperiment.json'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import microsampleData from 'assets/data/airtable/microsample.json'
import { hasRelatedRecords } from 'utils/hasRelatedRecords'
import MacrosampleTab from 'components/TabComponents/MacrosampleTab'
import CryosectionTab from 'components/TabComponents/CryosectionTab'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import Tabs from 'components/Tabs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'

const AnimalSpecimenOverview = () => {

  const { specimenName = '' } = useParams()
  const [selectedTab, setSelectedTab] = useState('Macrosamples')

  // Validate that the specimen exists
  const { validating, notFound } = useValidateParams({
    tableType: 'animalSpecimen',
    filterId: 'ID',
    filterValue: specimenName
  })

  // Filter data to find the specific specimen
  const data = useMemo(() => {
    return (animalSpecimenData).filter((record) => {
      const name = record.fields.ID
      return name && String(name).toLowerCase() === specimenName.toLowerCase()
    })
  }, [specimenName])

  const specimen = data[0]
  const tabs = useMemo(() => {
    const id = specimen?.fields.ID
    if (!id) return []

    return [
      hasRelatedRecords(macrosampleData, 'ID', id) && 'Macrosamples',
      hasRelatedRecords(cryosectionData, 'ID', id) && 'Cryosections',
      hasRelatedRecords(microsampleData, 'Code', id) && 'Microsamples',
    ].filter((tab): tab is string => Boolean(tab))
  }, [specimen?.fields.ID])
  const activeTab = tabs.includes(selectedTab) ? selectedTab : tabs[0]
  const trial = trialData.find((record) => record.fields.ID === specimen?.fields.Experiment_flat)
  const treatmentUrl = specimen && `/animal-specimens?${new URLSearchParams({
    trial: specimen.fields.Experiment_flat,
    treatment: specimen.fields.Treatment_flat,
  })}`

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {specimen && (
          <>
            <PageHeader
              title={specimenName}
              breadcrumbs={[
                { label: 'Data Portal Home', link: '/' },
                { label: 'Animal Specimens', link: '/animal-specimens' },
                { label: specimenName }
              ]}
              aside={specimen.fields['Biosample accession'] &&
                <dl className='grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 rounded-md bg-black/20 px-3 py-1.5 text-sm text-neutral-50/85 backdrop-blur-sm [&_dt]:flex [&_dt]:items-center [&_dt]:gap-2 [&_a]:font-bold [&_a]:transition-colors hover:[&_a]:text-light_mustard'>
                  <dt><TrailMark />Biosample accession:</dt>
                  <dd>
                    {specimen.fields['Biosample link']
                      ? <Link to={specimen.fields['Biosample link']} target='_blank' rel='noopener noreferrer'>
                        {specimen.fields['Biosample accession']}
                      </Link>
                      : specimen.fields['Biosample accession']}
                  </dd>
                </dl>
              }
            />

            <SummaryStrip
              label='Animal specimen summary'
              stats={[
                { label: 'Trial', value: specimen.fields.Experiment_flat, to: trial && `/animal-trials/${encodeURIComponent(trial.fields.Name)}`, title: trial?.fields.Name },
                { label: 'Treatment', value: specimen.fields.Treatment_flat, to: treatmentUrl },
                { label: 'Age', value: specimen.fields.SlaughteringDayCount != null ? `${specimen.fields.SlaughteringDayCount} days` : undefined },
                { label: 'Weight', value: specimen.fields.Weight != null ? `${specimen.fields.Weight} kg` : undefined },
              ]}
            />

            {tabs.length > 0 && <section className='page_padding pt-8 pb-2'>
              <Tabs
                selectedTab={activeTab}
                setSelectedTab={setSelectedTab}
                tabs={tabs}
              />
            </section>}
            <main className='pt-4'>
              {activeTab && <section id='related-data-panel' role='tabpanel' aria-label={activeTab} tabIndex={0}>
                {activeTab === 'Macrosamples' && <MacrosampleTab id={specimen.fields.ID} />}
                {activeTab === 'Cryosections' && <CryosectionTab id={specimen.fields.ID} />}
                {activeTab === 'Microsamples' && <MicrosampleTab id={specimen.fields.ID} />}
              </section>}
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default AnimalSpecimenOverview
