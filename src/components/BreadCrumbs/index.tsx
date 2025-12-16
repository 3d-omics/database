import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

const BreadCrumbs = ({ items }: {
  items: { label: string, link?: string }[]
}) => {
  return (
    <div className='breadcrumbs text-[12.5px] mb-3 max-md:text-2xs' data-testid='breadcrumbs'>
      <ul className=''>
        {items.map((item) => (
          <li key={item.label}>
            {item.link
              ? <Link to={item.link}>
                {item.label === 'Data Portal Home' ? (
                  <>
                    <span className='max-md:hidden'>{item.label}</span>
                    <FontAwesomeIcon icon={faHome} className='md:hidden' />
                  </>
                ) : (
                  item.label
                )}
              </Link>
              : <span className='font-semibold'>{item.label}</span>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BreadCrumbs