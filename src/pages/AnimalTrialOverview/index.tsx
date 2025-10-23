import { useState, useEffect, useRef } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AnimalSpecimenTab from './components/AnimalSpecimenTab'
import MacrosampleTab from './components/MacrosampleTab'
import MicrosampleTab from './components/MicrosampleTab'
import Tabs from 'components/Tabs'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import ErrorBanner from 'components/ErrorBanner'
import { airtableConfig } from 'config/airtable'
import BreadCrumbs from 'components/BreadCrumbs'
import Loading from 'components/Loading'
import NotFound from 'pages/NotFound'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'


const AnimalTrialOverview = () => {

  const { experimentName = '' } = useParams()

  const [selectedTab, setSelectedTab] = useState('Animal Specimen')

  const { animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId } = airtableConfig

  const { validating, notFound } = useValidateParams({
    tableType: 'animalTrialExperiment',
    filterId: 'Name',
    filterValue: experimentName
  })

  const { allData: data, allLoading: loading, allError: error } = useGetFirst100Data({
    AIRTABLE_BASE_ID: animalTrialExperimentBaseId,
    AIRTABLE_TABLE_ID: animalTrialExperimentTableId,
    AIRTABLE_VIEW_ID: animalTrialExperimentViewId,
    filterWith: [{ id: 'Name', value: experimentName }]
  })


  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {error && <div className='page_padding'><ErrorBanner>{error}</ErrorBanner></div>}
        {loading && <Loading />}
        {data &&
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
                  <b>{data[0]?.fields.ID}</b>
                </span>
                <span>
                  Start date:&nbsp;
                  <b>{data[0]?.fields.StartDate}</b>
                </span>
                <span>
                  End date:&nbsp;
                  <b>{data[0]?.fields.EndDate}</b>
                </span>
              </div>

              <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={['Animal Specimen', 'Macrosample', 'Microsample']}
              />
            </section>

            <main className='-mt-7'>
              {selectedTab === 'Animal Specimen' && <AnimalSpecimenTab experimentId={data[0]?.fields.ID} />}
              {selectedTab === 'Macrosample' && <MacrosampleTab experimentId={data[0]?.fields.ID} />}
              {selectedTab === 'Microsample' && <MicrosampleTab experimentId={data[0]?.fields.ID} />}
            </main>
          </>
        }
      </div>
    </ParamsValidator>
  )
}


export default AnimalTrialOverview