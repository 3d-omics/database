import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AnimalSpecimenTab from './components/AnimalSpecimenTab'
import MacrosampleTab from './components/MacrosampleTab'
import MicrosampleTab from './components/MicrosampleTab'
import Tabs from 'components/Tabs'
import BreadCrumbs from 'components/BreadCrumbs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'

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
  const [selectedTab, setSelectedTab] = useState('Animal Specimen')

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

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {experiment && (
          <>
            <section className='page_padding'>
              <BreadCrumbs
                items={[
                  { label: 'Home', link: '/' },
                  { label: 'Animal Trial/Experiment', link: '/animal-trial-experiment' },
                  { label: experimentName }
                ]}
              />

              <div className='flex items-end gap-4 mb-3'>
                <header className='main_header'>{experimentName}</header>
                <Link
                  to={`/genome-catalogues/${encodeURIComponent(experimentName)}`}
                  className="link"
                >
                  view MAG Catalogue
                </Link>
              </div>

              <div className='flex gap-4 text-sm text-gray-500 pb-8 font-thin [&>span]:flex [&>span]:gap-1'>
                <span>
                  Experiment ID:&nbsp;
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
              </div>

              <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={['Animal Specimen', 'Macrosample', 'Microsample']}
              />
            </section>

            <main className='-mt-7'>
              {selectedTab === 'Animal Specimen' && <AnimalSpecimenTab experimentId={experiment.fields.ID} />}
              {selectedTab === 'Macrosample' && <MacrosampleTab experimentId={experiment.fields.ID} />}
              {selectedTab === 'Microsample' && <MicrosampleTab experimentId={experiment.fields.ID} />}
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default AnimalTrialOverview


