import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'
import experimentsWithGenomeInfo from 'assets/data/airtable/experimentswithgenomeinfo.json'

const MAGCatalogueList = () => {

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>

      <header className='main_header mb-4'>List of MAG Catalogues</header>

      <p className='page_description'>
        Metagenome-assembled genome (MAG) catalogues are trial-specific collections of bacterial and archaeal genomes reconstructed from the faecal and intestinal samples collected from the experimental animals. Each catalogue contains hundreds of near-complete genomes reconstructed using hybrid DNA sequencing, combining long-read PacBio HiFi and short-read Illumina sequencing. In the following pages you will be able to browse these catalogues. Use the provided links to download the genome sequences and their annotations.
      </p>

      <ul className='space-y-4'>
        {animalTrialExperimentData.map((experiment) => {
          const link = experimentsWithGenomeInfo.filter((exp) => exp.fields.ID === experiment.fields.ID)[0]?.fields.link
          const doi = experimentsWithGenomeInfo.filter((exp) => exp.fields.ID === experiment.fields.ID)[0]?.fields.doi
          return <li key={experiment.id}>

            <div className='group relative flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'>
              <div>
                <Link
                  to={`/mag-catalogues/${encodeURIComponent(experiment.fields.Name)}`}
                  className='before:absolute before:inset-0 before:z-0'
                >
                  <h1 className='text-lg font-medium mb-1 group-hover:text-mustard group-hover:underline'>
                    {experiment.fields.Name}
                  </h1>
                </Link>

                <div className='flex gap-4 text-xs text-gray-500 font-extralight [&>span]:flex [&>span]:gap-1 max-md:flex-col max-md:gap-0'>
                  {
                    experiment.fields['MAG catalogue - Number of MAGs'] &&
                    <span>
                      Number of MAGs:&nbsp;
                      <b>{experiment.fields['MAG catalogue - Number of MAGs']}</b>
                    </span>
                  }
                  {
                    experiment.fields['MAG catalogue - Average completeness (%)'] &&
                    <span>
                      Average completeness:&nbsp;
                      <b>{experiment.fields['MAG catalogue - Average completeness (%)'].toFixed(2)}%</b>
                    </span>
                  }
                  {
                    experiment.fields['MAG catalogue - Average contamination (%)'] &&
                    <span>
                      Average contamination:&nbsp;
                      <b>{experiment.fields['MAG catalogue - Average contamination (%)'].toFixed(2)}%</b>
                    </span>
                  }
                  {
                    experiment.fields['MAG catalogue - New species (%)'] &&
                    <span>
                      New species:&nbsp;
                      <b>{experiment.fields['MAG catalogue - New species (%)']}%</b>
                    </span>
                  }
                </div>

                {(link || doi) &&
                  <div className='flex gap-4 text-xs text-gray-500 font-thin [&>span]:flex [&>span]:gap-1 mt-2 relative z-10'>
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
            </div>
          </li>
        })}
      </ul>

    </div>
  )
}

export default MAGCatalogueList