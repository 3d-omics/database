import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import experimentsWithGenomeInfo from 'assets/data/airtable/experimentswithgenomeinfo.json'
import experimentG from 'assets/data/metabolomics/metabolomics_G.xlsx'
import experimentH from 'assets/data/metabolomics/metabolomics_H.xlsx'
import experimentI from 'assets/data/metabolomics/metabolomics_I.xlsx'
import experimentJ from 'assets/data/metabolomics/metabolomics_J.xlsx'
import experimentK from 'assets/data/metabolomics/metabolomics_K.xlsx'
import experimentM from 'assets/data/metabolomics/metabolomics_M.xlsx'


const MetabolomicsList = () => {

  // for download excel file button
  const files = {
    'G': experimentG,
    'H': experimentH,
    'I': experimentI,
    'J': experimentJ,
    'K': experimentK,
    'M': experimentM
  }

  const handleDownload = ({ experimentId }: { experimentId: string }) => {
    const excelFile = files[experimentId as keyof typeof files];
    if (!excelFile) {
      console.error('File not found for param:', experimentId);
      return;
    }
    const link = document.createElement('a');
    link.href = excelFile;
    link.download = `metabolite-data-experiment-${experimentId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <header className='main_header mb-4'>Metabolomics</header>

      <p className='page_description'>
        Metabolic landscapes of the intestine were produced for each animal specimen using intestinal content and tissue samples. Here, you can visualise differences between different contrasting groups across various experiments.
      </p>

      <ul className=''>
        {experimentsWithGenomeInfo
          .map((experiment) => (
            <li key={experiment.id} className='mb-12'>
              <h2 className='main_header text-lg link w-fit mb-0.5'>
                <Link to={`/animal-trials/${experiment.fields.Name}`}>
                  {experiment.fields.Name}
                </Link>
              </h2>

              <div className='grid grid-cols-3 gap-4 max-md:grid-cols-1 max-md:gap-2'>
                <Link
                  to={`/metabolomics/volcano/${encodeURIComponent(experiment.fields.Name)}`}
                  className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
                >
                  <div>
                    <h3 className='text-lg font-medium mb-1 group-hover:text-mustard group-hover:underline'>
                      Volcano Plot
                    </h3>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
                </Link>

                <Link
                  to={`/metabolomics/heatmap/${encodeURIComponent(experiment.fields.Name)}`}
                  className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
                >
                  <div>
                    <h3 className='text-lg font-medium mb-1 group-hover:text-mustard group-hover:underline'>
                      Heatmap
                    </h3>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
                </Link>

                <button
                  onClick={() => handleDownload({ experimentId: experiment.fields.ID })}
                  className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
                >
                  <h3 className='text-lg font-medium text-left mb-1 group-hover:text-mustard group-hover:underline'>
                    <FontAwesomeIcon icon={faFileArrowDown} className='mr-1' data-testid='download-tsv-icon' />
                    Download Excel File for experiment {experiment.fields.ID}
                  </h3>
                  <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
                </button>
              </div>
            </li>
          ))}
      </ul>

    </div>
  )
}

export default MetabolomicsList