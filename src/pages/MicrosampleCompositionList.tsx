import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'

const MicrosampleCompositionList = () => {

  console.log(cryosectionImageData.map(cryosection => cryosection.fields))

  return (
    <div className='page_padding pt-7 min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <header className='main_header mb-6'>List of Cryosections with Genome Composition Image + Bar stack plot</header>

        <ul className='space-y-4'>
          {cryosectionImageData.map((cryosection) => (
            <li key={cryosection.fields.ID}>
              <Link
                to={`/microsample-composition/${cryosection.fields.ID}`}
                className='group flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white hover:bg-gray-50'
              >
                <span className='text-lg font-medium group-hover:text-mustard group-hover:underline'>
                  {cryosection.fields.ID}
                </span>
                <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5 group-hover:text-mustard group-hover:translate-x-1 transition-transform' />
              </Link>
            </li>
          ))}
        </ul>
        
    </div>
  )
}

export default MicrosampleCompositionList

