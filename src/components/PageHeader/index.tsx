import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import { SITE_TITLE } from 'config/siteTitle'

// The header every page opens with, laid out after the Methods pages: the
// breadcrumb trail, title and introduction on the triangle-patterned prism
// banner of the home page, which follows straight on from the navbar
const PageHeader = ({ title, breadcrumbs, aside, children }: {
  title: string
  breadcrumbs: { label: string, link?: string }[]
  // Set to the right of the title and centred on it, or below it on narrower screens
  aside?: ReactNode
  children?: ReactNode
}) => {

  // The browser tab names the page the way its header does: the title, then the
  // level above it in the trail unless that is the home page. It is set again on
  // every navigation, after App has reset the tab for pages without a header
  const location = useLocation()
  const parent = breadcrumbs[breadcrumbs.length - 2]
  const tabTitle = parent && parent.link !== '/' ? `${title} - ${parent.label}` : title
  useEffect(() => {
    document.title = `${tabTitle} | ${SITE_TITLE}`
  }, [tabTitle, location])

  const heading = <h1 className='main_header text-4xl text-light_mustard break-words max-md:text-3xl'>{title}</h1>

  return (
    <header className='page_padding pt-6 pb-10 bg-prism text-neutral-50 max-md:pt-4'>
      <BreadCrumbs items={breadcrumbs} />
      {aside
        ? <div className='flex items-center justify-between gap-x-8 gap-y-4 max-lg:flex-col max-lg:items-start [&>h1]:min-w-0'>
          {heading}
          {aside}
        </div>
        : heading
      }
      {children &&
        <div className='mt-4 max-w-4xl text-sm leading-relaxed space-y-3'>{children}</div>
      }
    </header>
  )
}

export default PageHeader
