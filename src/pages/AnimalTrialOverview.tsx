import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AnimalSpecimenTab from '../components/TabComponents/AnimalSpecimenTab'
import MacrosampleTab from 'components/TabComponents/MacrosampleTab'
import CryosectionTab from 'components/TabComponents/CryosectionTab'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import Tabs from 'components/Tabs'
import PageHeader from 'components/PageHeader'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import microsampleData from 'assets/data/airtable/microsample.json'
import { hasRelatedRecords } from 'utils/hasRelatedRecords'

interface AnimalTrialExperiment {
  id: string
  createdTime: string
  fields: {
    ID: string
    Name: string
    StartDate: string
    EndDate: string
    Type?: string
    [key: string]: any
  }
}

const AnimalTrialOverview = () => {
  
  const { experimentName = '' } = useParams()
  const [selectedTab, setSelectedTab] = useState('Animal Specimens')

  // Validate that the experiment exists
  const { validating, notFound } = useValidateParams({
    tableType: 'animalTrialExperiment',
    filterId: 'Name',
    filterValue: experimentName
  })

  // Filter data to find the specific experiment
  const data = useMemo(() => {
    return (animalTrialExperimentData as AnimalTrialExperiment[]).filter((record) => {
      const name = record.fields.Name
      return name && String(name).toLowerCase() === experimentName.toLowerCase()
    })
  }, [experimentName])

  const experiment = data[0] // Get the first (and should be only) match
  const tabs = useMemo(() => {
    const id = experiment?.fields.ID
    if (!id) return []

    return [
      hasRelatedRecords(animalSpecimenData, 'Experiment_flat', id, 'equals') && 'Animal Specimens',
      hasRelatedRecords(macrosampleData, 'ID', id) && 'Macrosamples',
      hasRelatedRecords(cryosectionData, 'ID', id) && 'Cryosections',
      hasRelatedRecords(microsampleData, 'Code', id) && 'Microsamples',
    ].filter((tab): tab is string => Boolean(tab))
  }, [experiment?.fields.ID])
  const activeTab = tabs.includes(selectedTab) ? selectedTab : tabs[0]

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {experiment && (
          <>
            <PageHeader
              title={experimentName}
              breadcrumbs={[
                { label: 'Data Portal Home', link: '/' },
                { label: 'Animal Trials', link: '/animal-trials' },
                { label: experimentName }
              ]}
            >
              <div className='flex flex-wrap gap-x-4 gap-y-0.5 [&>span]:flex [&>span]:gap-1 max-lg:flex-col'>
                <span>
                  Trial ID:&nbsp;
                  <b>{experiment.fields.ID}</b>
                </span>
                <span>
                  Start date:&nbsp;
                  <b>{experiment.fields.StartDate}</b>
                </span>
                <span>
                  End date:&nbsp;
                  <b>{experiment.fields.EndDate}</b>
                </span>
                <span>
                  Bioproject Accession:&nbsp;
                  <Link to={experiment.fields['Bioproject link']} className='link' target='_blank' rel='noopener noreferrer'>
                    <b>{experiment.fields['Bioproject accession']}</b>
                  </Link>
                </span>
                <Link
                  to={`/mag-catalogues/${encodeURIComponent(experimentName)}`}
                  className='link'
                >
                  View MAG Catalogue
                </Link>
              </div>

              <div>
                {experiment.fields['Trial description']?.split('\n').map((line: string, index: number) => {
                  const parts = line.split('**')
                  return (
                  <span key={index}>
                    {parts.map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                    <br />
                  </span>
                  )
                })}
              </div>
            </PageHeader>

            {tabs.length > 0 && <section className='page_padding pt-8 pb-2'>
              <Tabs
                selectedTab={activeTab}
                setSelectedTab={setSelectedTab}
                tabs={tabs}
              />
            </section>}

            <main className='pt-4'>
              {activeTab && <section id='related-data-panel' role='tabpanel' aria-label={activeTab} tabIndex={0}>
                {activeTab === 'Animal Specimens' && <AnimalSpecimenTab experimentId={experiment.fields.ID} />}
                {activeTab === 'Macrosamples' && <MacrosampleTab id={experiment.fields.ID} />}
                {activeTab === 'Cryosections' && <CryosectionTab id={experiment.fields.ID} />}
                {activeTab === 'Microsamples' && <MicrosampleTab id={experiment.fields.ID} />}
              </section>}
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default AnimalTrialOverview
