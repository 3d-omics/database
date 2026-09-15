import { Fragment, useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import SocialIcons from '../SocialIcons'
import ThemeToggle from 'components/ThemeToggle'
import MenuMark from './MenuMark'
import PortalTag from './PortalTag'
import { menus } from './MenuItems'
import Logo from 'src/assets/images/3domics-logo.png'

// A link in the drawer. The page that is open is tinted burgundy and carries the
// site's triangle mark; the link hovered gets the mark over a neutral wash, so
// the two never look alike. The pages of a section sit indented under it
const MenuLink = ({ to, indented = false, onClick, children }: {
  to: string
  indented?: boolean
  onClick: () => void
  children: ReactNode
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `group/sub flex items-center gap-3 rounded-md py-2.5 pr-4 text-base font-semibold whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none max-sm:text-[15px] ${indented ? 'pl-8' : 'pl-4'} ${isActive ? 'bg-burgundy_ink/10 text-burgundy_ink' : 'hover:bg-surface_strong/60 hover:text-burgundy_ink'}`}
  >
    {({ isActive }) => (
      <>
        <MenuMark active={isActive} />
        {children}
      </>
    )}
  </NavLink>
)

const MobileMenu = () => {

  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)
  const closeMenu = () => setMobileMenuOpened(false)

  return (
    <>
      {/* ===== Mobile menu hamburger =====  */}
      <div
        className={`lg:hidden self-center tham tham-e-squeeze tham-w-7 z-[60] ${mobileMenuOpened && 'tham-active'}`}
        onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
        data-testid='hamburger-menu'
      >
        <div className='tham-box'>
          <div className='tham-inner !h-[2px] bg-ink_muted rounded-none after:rounded-none after:!h-[2px] before:rounded-none before:!h-[2px]' />
        </div>
      </div>


      {/* ===== Mobile menu ===== */}
      {mobileMenuOpened && (
        <>
          <div
            className='fixed inset-0 z-20 bg-black/40 animate-fade-in motion-reduce:animate-none lg:hidden'
            onClick={closeMenu}
            data-testid='mobile-menu-overlay'
          />

          {/* A frosted drawer with the gradient of the prism banner down its leading
              edge. It is a sibling of the scrim rather than inside it, since a
              translucent or filtered ancestor would stop its own blur reaching the page */}
          <nav
            className='fixed right-0 top-0 z-30 flex h-dvh w-7/12 flex-col bg-surface_subtle/85 shadow-2xl backdrop-blur-xl backdrop-saturate-150 animate-slide-in-right motion-reduce:animate-none max-sm:w-10/12 lg:hidden'
            data-testid='mobile-menu-opened'
          >
            <span aria-hidden='true' className='absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-mustard to-burgundy_ink' />

            <div className='flex flex-1 flex-col overflow-y-auto px-3 pt-20'>
              <div className='mb-3 flex items-center justify-between border-b border-line/60 pb-3 pr-1'>
                <div className='flex items-center'>
                  <Link
                    to='http://www.3domics.eu'
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={closeMenu}
                    className='btn btn-ghost px-2'
                  >
                    <img src={Logo} alt="3D'omics logo" className='h-8 object-contain' />
                  </Link>
                  <PortalTag onClick={closeMenu} />
                </div>
                <ThemeToggle />
              </div>

              <ul className='space-y-0.5 pb-6'>
                {menus.map((menu) => (
                  menu.sectionTitle
                    ? (
                      <Fragment key={menu.sectionTitle}>
                        {/* A section with no same-named link still needs a heading over its sub-links */}
                        {!menu.subMenus.some((subMenu) => subMenu.title === menu.sectionTitle) && (
                          <li className='px-4 pt-4 pb-1 text-2xs font-bold uppercase tracking-[0.14em] text-ink_muted'>
                            {menu.sectionTitle}
                          </li>
                        )}
                        {menu.subMenus.map((subMenu) => (
                          <li key={subMenu.location}>
                            <MenuLink
                              to={subMenu.location}
                              indented={subMenu.title !== menu.sectionTitle}
                              onClick={closeMenu}
                            >
                              {subMenu.title}
                            </MenuLink>
                          </li>
                        ))}
                      </Fragment>
                    ) : (
                      <li key={menu.title}>
                        <MenuLink to={menu.location ?? '/'} onClick={closeMenu}>{menu.title}</MenuLink>
                      </li>
                    )
                ))}
              </ul>

              <section className='mt-auto border-t border-line/60 py-8'>
                <SocialIcons
                  ulClassName='gap-6 [&_svg]:text-2xl [&>li:hover_svg]:text-mustard'
                />
              </section>
            </div>
          </nav>
        </>
      )}
    </>
  )
}

export default MobileMenu
