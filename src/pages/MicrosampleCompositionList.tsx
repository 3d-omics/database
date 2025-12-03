import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'

const MicrosampleCompositionList = () => {

  // console.log(cryosectionImageData.map(cryosection => cryosection.fields))

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <header className='main_header mb-6'>Microsample Community Composition</header>

      <p className='page_description'>
        Micro-scale microbial communities reconstructed from microsamples collected from thin intestinal cross-cuts (cryosections) using laser capture microdissection. Each microsample typically covers a volume of about 50,000 μm3, which usually encompass between 100 and 2000 bacterial cells. Microsamples are spatially referenced, enabling analysis of microbial community variation across space within the gut.
      </p>

      <ul className=''>
        {Object.entries(
          cryosectionImageData.reduce((acc, cryosection) => {
            const prefix = cryosection.fields.ID.substring(0, 4)
            if (!acc[prefix]) {
              acc[prefix] = []
            }
            acc[prefix].push(cryosection)
            return acc
          }, {} as Record<string, typeof cryosectionImageData>)
        ).map(([prefix, cryosections]) => (
          <li key={prefix} className='mb-8'>
            <h2 className='main_header text-lg link w-fit mb-0.5'>
              <Link to={`/animal-specimens/${prefix}`}>
                {prefix}
              </Link>
            </h2>
            <div className='grid grid-cols-3 gap-4'>
              {cryosections.map((cryosection) => (
                <Link
                  key={cryosection.fields.ID}
                  to={`/microsample-compositions/${cryosection.fields.ID}`}
                  className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
                >
                  <div>
                    <h1 className='text-lg font-medium group-hover:text-mustard group-hover:underline'>
                      {cryosection.fields.ID}
                    </h1>
                    <div className='flex gap-4 text-xs text-gray-500 font-extralight [&>span]:flex [&>span]:gap-1 max-md:flex-col max-md:gap-0'>
                      <span>
                        Number of microsamples:&nbsp;
                        <b>{cryosection.fields['Microsample number']}</b>
                      </span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default MicrosampleCompositionList

