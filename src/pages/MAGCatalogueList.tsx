import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'
import experimentsWithGenomeInfo from 'assets/data/airtable/experimentswithgenomeinfo.json'

const MAGCatalogueList = () => {

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>

      <header className='main_header mb-4'>List of MAG Catalogues</header>

      <ul className='space-y-4'>
        {animalTrialExperimentData.map((experiment) => {
          const link = experimentsWithGenomeInfo.filter((exp) => exp.fields.ID === experiment.fields.ID)[0]?.fields.link
          const doi = experimentsWithGenomeInfo.filter((exp) => exp.fields.ID === experiment.fields.ID)[0]?.fields.doi
          return <li key={experiment.id}>
            <Link
              to={`/mag-catalogues/${encodeURIComponent(experiment.fields.Name)}`}
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

                {(link || doi) &&
                  <div className='flex gap-4 text-xs text-gray-500 font-thin [&>span]:flex [&>span]:gap-1 mt-1'>
                    {link &&
                      <span>
                        Link:&nbsp;
                        <Link to={link} target="_blank" rel="noopener noreferrer" className="link">
                          <b>{link}</b>
                        </Link>
                      </span>
                    }
                    {doi &&
                      <span>
                        DOI:&nbsp;
                        <b>{doi}</b>
                      </span>
                    }
                  </div>
                }
              </div>
              <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
            </Link>
          </li>
        })}
      </ul>


    </div>
  )
}

export default MAGCatalogueList
