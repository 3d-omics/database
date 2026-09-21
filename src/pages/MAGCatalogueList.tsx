import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'
import experimentsWithGenomeInfo from 'assets/data/airtable/experimentswithgenomeinfo.json'
import PageHeader from 'components/PageHeader'
import TrialBlock from 'components/TrialBlock'
import { getSummaryStats } from 'pages/MAGCatalogue/utils/summaryStats'

const MAGCatalogueList = () => {

  return (
    <div className='min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>

      <PageHeader
        title='MAG Catalogues'
        breadcrumbs={[
          { label: 'Data Portal Home', link: '/' },
          { label: 'MAG Catalogues' },
        ]}
      >
        <p>
          Metagenome-assembled genome (MAG) catalogues are trial-specific collections of bacterial and archaeal genomes reconstructed from the faecal and intestinal samples collected from the experimental animals. Each catalogue contains hundreds of near-complete genomes reconstructed using hybrid DNA sequencing, combining long-read PacBio HiFi and short-read Illumina sequencing. In the following pages you will be able to browse these catalogues. Use the provided links to download the genome sequences and their annotations.
        </p>
      </PageHeader>

      <ul className='page_padding flex flex-col gap-4'>
        {animalTrialExperimentData.map((experiment) => {
          const genomeInfo = experimentsWithGenomeInfo.find((exp) => exp.fields.ID === experiment.fields.ID)?.fields
          const link = genomeInfo?.link
          const doi = genomeInfo?.doi

          return <TrialBlock
            key={experiment.id}
            fields={experiment.fields}
            stats={getSummaryStats(experiment.fields)}
            to={`/mag-catalogues/${encodeURIComponent(experiment.fields.Name)}`}
            browseLabel='Browse catalogue'
            aside={doi &&
              <div>
                <p className='mb-1 text-xs uppercase tracking-wide text-ink_muted'>DOI</p>
                <code className='block rounded-md border border-line bg-surface px-4 py-3 font-mono text-sm break-all'>
                  <span className='select-all'>{doi}</span>
                </code>
              </div>
            }
            actions={link &&
              <Link to={link} target='_blank' rel='noopener noreferrer'>
                <FontAwesomeIcon icon={faDownload} /> Download
              </Link>
            }
          />
        })}
      </ul>

    </div>
  )
}

export default MAGCatalogueList
