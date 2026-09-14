import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import { SITE_TITLE } from 'config/siteTitle'

// The header every page opens with, laid out after the Methods pages: the
// breadcrumb trail, then the title and introduction on the triangle-patterned
// prism banner of the home page
const PageHeader = ({ title, breadcrumbs, children }: {
  title: string
  breadcrumbs: { label: string, link?: string }[]
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

  return (
    <>
      <div className='page_padding pb-0'>
        <BreadCrumbs items={breadcrumbs} />
      </div>

      <header className='page_padding py-10 bg-prism text-neutral-50'>
        <h1 className='main_header text-4xl text-light_mustard break-words max-md:text-3xl'>{title}</h1>
        {children &&
          <div className='mt-4 max-w-4xl text-sm leading-relaxed space-y-3'>{children}</div>
        }
      </header>
    </>
  )
}

export default PageHeader
