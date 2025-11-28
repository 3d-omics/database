import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'

const MacrosampleCompositionList = () => {

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <header className='main_header mb-4'>Macrosample Community Composition</header>
      <ul className='space-y-4'>
        {animalTrialExperimentData.map((experiment) => (
          <li key={experiment.id}>
            <Link
              to={`/macrosample-composition/${encodeURIComponent(experiment.fields.Name)}`}
              className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
            >
              <div>
                <h1 className='text-lg font-medium mb-1 group-hover:text-mustard group-hover:underline'>
                  {experiment.fields.Name}
                </h1>
                <div className='flex gap-4 text-xs text-gray-500 font-extralight [&>span]:flex [&>span]:gap-1 max-md:flex-col max-md:gap-0'>
                  <span>
                    Number of MAGs:&nbsp;
                    <b>{experiment.fields['MAG catalogue - Number of MAGs']}</b>
                  </span>
                  <span>
                    Average completeness:&nbsp;
                    <b>{experiment.fields['MAG catalogue - Average completeness (%)']}%</b>
                  </span>
                  <span>
                    Average contamination:&nbsp;
                    <b>{experiment.fields['MAG catalogue - Average contamination (%)']}%</b>
                  </span>
                  <span>
                    New species:&nbsp;
                    <b>{experiment.fields['MAG catalogue - New species (%)']}%</b>
                  </span>
                </div>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default MacrosampleCompositionList
