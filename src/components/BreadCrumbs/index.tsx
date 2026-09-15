import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

// Levels are separated by a triangle in the mustard-to-burgundy gradient of the
// site's prism banner, the same mark as the section headings of the Methods pages
const Separator = () => (
  <span aria-hidden='true' className='w-1.5 h-[7px] shrink-0 clip-triangle bg-gradient-to-b from-mustard to-burgundy' />
)

const BreadCrumbs = ({ items }: {
  items: { label: string, link?: string }[]
}) => {
  return (
    <nav aria-label='Breadcrumb' className='text-[12.5px] mb-3 max-md:text-2xs' data-testid='breadcrumbs'>
      <ol className='flex flex-wrap items-center gap-x-2.5 gap-y-1 text-ink'>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={item.label} className='flex items-center gap-2.5'>
              {index > 0 && <Separator />}
              {item.link
                ? <Link to={item.link} className='hover:text-mustard'>
                  {item.label === 'Data Portal Home' ? (
                    <>
                      <span className='max-md:sr-only'>{item.label}</span>
                      <FontAwesomeIcon icon={faHome} className='md:hidden' />
                    </>
                  ) : (
                    item.label
                  )}
                </Link>
                : <span
                  className={isCurrent ? 'font-semibold text-burgundy_ink' : ''}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              }
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadCrumbs
