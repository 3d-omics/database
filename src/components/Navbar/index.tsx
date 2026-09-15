import { useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faHome } from '@fortawesome/free-solid-svg-icons'
import MobileMenu from './MobileMenu'
import MenuMark from './MenuMark'
import { menus } from './MenuItems'
import ThemeToggle from 'components/ThemeToggle'
import Logo from 'src/assets/images/3domics-logo.png'

const testId = (title = '') => title.toLowerCase().replace(/\s/g, '-')

// A dropdown is marked while one of its pages, or a page below one, is open, the
// way NavLink marks a link
const covers = (pathname: string, location: string) =>
  pathname === location || pathname.startsWith(`${location}/`)

// Top-level entries fill the height of the bar. The entry of the page that is
// open, or the one hovered or focused, is lit by a glow rising from the bottom
// edge and underlined, from the centre outwards, in the mustard-to-burgundy
// gradient of the prism banner that follows the bar
const entryClass = (active: boolean) =>
  `relative isolate flex items-center gap-1.5 px-2.5 whitespace-nowrap outline-none transition-colors duration-200 motion-reduce:transition-none max-xl:px-1.5 ${active
    ? 'text-burgundy_ink'
    : 'group-hover/entry:text-burgundy_ink group-has-[:focus-visible]/entry:text-burgundy_ink'}`

const Highlight = ({ active }: { active: boolean }) => (
  <>
    <span
      aria-hidden='true'
      className={`absolute inset-0 -z-10 bg-gradient-to-t from-burgundy_ink/10 to-transparent transition-opacity duration-300 motion-reduce:transition-none ${active ? '' : 'opacity-0 group-hover/entry:opacity-100 group-has-[:focus-visible]/entry:opacity-100'}`}
    />
    <span
      aria-hidden='true'
      className={`absolute inset-x-2 bottom-0 h-[3px] bg-gradient-to-r from-mustard to-burgundy_ink transition-transform duration-300 ease-out motion-reduce:transition-none ${active ? '' : 'scale-x-0 group-hover/entry:scale-x-100 group-has-[:focus-visible]/entry:scale-x-100'}`}
    />
  </>
)

const Navbar = () => {

  const { pathname } = useLocation()
  const navbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navbarRef.current) {
      document.documentElement.style.setProperty(
        '--navbar-height',
        `${navbarRef.current.offsetHeight}px`
      )
    }
  }, [])

  return (
    <nav
      className='!sticky top-0 z-40 flex items-stretch min-h-16 px-8 max-xl:px-6 max-sm:px-3'
      data-testid='desktop-navbar'
      ref={navbarRef}
    >
      {/* The frosted bar is a layer of its own: a backdrop filter on the nav would
          stop the dropdowns blurring the page beneath them, and would pin the fixed
          mobile drawer to the bar rather than the viewport */}
      <div aria-hidden='true' className='absolute inset-0 -z-10 border-b border-line/60 bg-surface_subtle/80 shadow-sm backdrop-blur-xl backdrop-saturate-150' />

      <div className='flex-1 flex items-center'>
        <Link
          to={'http://www.3domics.eu'}
          target='_blank'
          className='btn btn-ghost text-xl max-xl:px-2 max-sm:px-1'
        >
          <img src={Logo} alt="3D'omics logo" className='h-10 object-contain' />
        </Link>
        <span aria-hidden='true' className='h-7 w-px mx-2 rotate-[20deg] bg-line_strong max-sm:mx-1' />
        <div className='group/entry flex self-stretch'>
          <NavLink
            to='/'
            end
            className={({ isActive }) => `${entryClass(isActive)} font-jakarta font-bold text-[15px] max-sm:text-xs`}
          >
            {({ isActive }) => (
              <>
                {/* Between lg and xl the full menu leaves no room for the label, so
                    the home page is an icon there, as in the breadcrumbs on phones */}
                <span className='lg:max-xl:sr-only'>Data Portal Home</span>
                <FontAwesomeIcon icon={faHome} className='hidden text-base lg:max-xl:inline' />
                <Highlight active={isActive} />
              </>
            )}
          </NavLink>
        </div>
      </div>

      <ul className='flex text-[13px] font-semibold max-xl:text-xs max-lg:hidden'>
        {menus.map((menu, index) => {
          if (menu.sectionTitle) {
            const active = menu.subMenus.some((subMenu) => covers(pathname, subMenu.location))
            return (
              <li
                className='group/entry relative flex'
                key={menu.sectionTitle}
                data-testid={`parentmenu-${testId(menu.sectionTitle)}`}
              >
                <button
                  type='button'
                  aria-current={active ? 'true' : undefined}
                  className={entryClass(active)}
                >
                  {menu.sectionTitle}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className='text-[9px] transition-transform duration-300 motion-reduce:transition-none group-hover/entry:rotate-180 group-has-[:focus-visible]/entry:rotate-180'
                  />
                  <Highlight active={active} />
                </button>

                {/* Frosted like the bar, and opened by the pointer or by keyboard focus,
                    not mouse focus, so a clicked link does not hold it open. The padding
                    bridges the pointer across to the entry, and the last dropdown opens
                    leftwards so it stays inside the viewport */}
                <div className={`invisible absolute top-full pt-2 transition-[visibility] duration-200 group-hover/entry:visible group-has-[:focus-visible]/entry:visible ${index === menus.length - 1 ? 'right-0' : 'left-0'}`}>
                  <ul className='relative min-w-[13rem] overflow-hidden rounded-lg border border-line/60 bg-surface/75 p-1.5 font-medium shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150 opacity-0 -translate-y-1 transition duration-200 ease-out motion-reduce:transition-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-mustard before:to-burgundy_ink group-hover/entry:opacity-100 group-hover/entry:translate-y-0 group-has-[:focus-visible]/entry:opacity-100 group-has-[:focus-visible]/entry:translate-y-0 dark:shadow-black/40'>
                    {menu.subMenus.map((subMenu) => (
                      <li
                        key={subMenu.title}
                        data-testid={`submenu-${testId(subMenu.title)}`}
                      >
                        <NavLink
                          to={subMenu.location}
                          className={({ isActive }) => `group/sub flex items-center gap-2.5 rounded-md px-3 py-2 whitespace-nowrap outline-none transition-colors duration-200 motion-reduce:transition-none ${isActive ? 'bg-burgundy_ink/10 text-burgundy_ink' : 'hover:bg-surface_strong/60 hover:text-burgundy_ink focus-visible:bg-surface_strong/60 focus-visible:text-burgundy_ink'}`}
                        >
                          {({ isActive }) => (
                            <>
                              <MenuMark active={isActive} />
                              {subMenu.title}
                            </>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          }

          return (
            <li
              className='group/entry flex'
              key={menu.title}
              data-testid={`parentmenu-${testId(menu.title)}`}
            >
              <NavLink to={menu.location ?? '/'} className={({ isActive }) => entryClass(isActive)}>
                {({ isActive }) => (
                  <>
                    {menu.title}
                    <Highlight active={isActive} />
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>

      <ThemeToggle className='ml-3 self-center max-lg:hidden' />
      <MobileMenu />
    </nav>
  )
}

export default Navbar
