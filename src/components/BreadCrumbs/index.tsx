import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

// The trail opens the prism banner of the page header, so it takes the banner's
// light colours: levels are separated by a triangle in the light mustard of the
// page title, the same mark as the section headings of the Methods pages
const Separator = () => (
  <span aria-hidden='true' className='w-1.5 h-[7px] shrink-0 clip-triangle bg-light_mustard' />
)

const BreadCrumbs = ({ items }: {
  items: { label: string, link?: string }[]
}) => {
  return (
    <nav aria-label='Breadcrumb' className='text-[12.5px] mb-6 max-md:mb-4 max-md:text-2xs' data-testid='breadcrumbs'>
      {/* A translucent strip keeps the trail legible over the mustard end of the banner */}
      <ol className='inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-md bg-black/20 px-3 py-1.5 text-neutral-50/85 backdrop-blur-sm'>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={item.label} className='flex items-center gap-2.5'>
              {index > 0 && <Separator />}
              {item.link
                ? <Link to={item.link} className='transition-colors hover:text-light_mustard'>
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
                  className={isCurrent ? 'font-semibold text-neutral-50' : ''}
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
