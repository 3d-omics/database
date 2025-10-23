import useGetFirst100Data from 'hooks/useGetFirst100Data'
import { airtableConfig } from 'config/airtable'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import ErrorBanner from 'components/ErrorBanner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const MacrosampleCompositionList = () => {

  const { animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId } = airtableConfig

  const { first100Data, first100Loading, first100Error } = useGetFirst100Data({
    AIRTABLE_BASE_ID: animalTrialExperimentBaseId,
    AIRTABLE_TABLE_ID: animalTrialExperimentTableId,
    AIRTABLE_VIEW_ID: animalTrialExperimentViewId,
  })

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <header className='main_header mb-4'>List of Macrosample Composition</header>
      {first100Loading && <Loading />}
      {first100Error && <ErrorBanner>{first100Error}</ErrorBanner>}
      {!first100Loading && first100Data &&
        <ul className='space-y-4'>
          {first100Data.map((experiment) => (
            <li key={experiment.id}>
              <Link
                to={`/macrosample-composition/${encodeURIComponent(experiment.fields.Name)}`}
                className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
              >
                <span className='text-lg font-medium group-hover:text-mustard group-hover:underline'>
                  {experiment.fields.Name}
                </span>
                <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
              </Link>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default MacrosampleCompositionList