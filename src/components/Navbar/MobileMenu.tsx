import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import SocialIcons from '../SocialIcons'
import { menus } from './MenuItems'

const MobileMenu = () => {

  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)
  const location = useLocation().pathname

  return (
    <>
      {/* ===== Mobile menu hamburger =====  */}
      <div
        className={`lg:hidden tham tham-e-squeeze tham-w-7 z-[60] ${mobileMenuOpened && 'tham-active'}`}
        onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
        data-testid="hamburger-menu"
      >
        <div className="tham-box">
          <div className="tham-inner !h-[2px] bg-neutral-500 rounded-none after:rounded-none after:!h-[2px] before:rounded-none before:!h-[2px]" />
        </div>
      </div>


      {/* ===== Mobile menu ===== */}
      <div className="relative">
        {mobileMenuOpened ? (
          <div
            className="fixed right-0 top-0 w-screen h-screen bg-black/30 z-20 duration-300"
            onClick={() => setMobileMenuOpened(false)}
            data-testid="mobile-menu-overlay"
          >
            <nav
              className="w-7/12 max-sm:w-9/12 bg-neutral-50 h-screen ml-auto duration-300 translate-x-0 pt-28"
              onClick={(e) => e.stopPropagation()}
              data-testid="mobile-menu-opened"
            >
              <ul className='[&>li]:border-b'>

                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpened(false)}
                    className={`block text-lg py-3 pl-6 font-semibold hover:bg-burgundy ${location === '/' ? 'text-mustard' : 'hover:text-white'} max-sm:text-base`}
                  >
                    Home
                  </Link>
                </li>

                {menus.map((menu) => (
                  menu.sectionTitle
                    ? (
                      menu.subMenus.map((subMenu) => (
                        <li key={subMenu.title}>
                          <Link
                            to={subMenu.location}
                            onClick={() => setMobileMenuOpened(false)}
                            className={`block text-lg py-3 pl-6 font-semibold whitespace-nowrap hover:bg-burgundy ${location === subMenu.location ? 'text-mustard' : 'hover:text-white'} max-sm:text-base`}
                          >
                            {subMenu.title !== menu.sectionTitle && <FontAwesomeIcon icon={faCaretRight} className='mr-2 ml-3' />}
                            {subMenu.title}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li key={menu.title}>
                        <Link
                          to={menu.location ?? '/'}
                          onClick={() => setMobileMenuOpened(false)}
                          className={`block text-lg py-3 pl-6 font-semibold whitespace-nowrap hover:bg-burgundy ${location === menu.location ? 'text-mustard' : 'hover:text-white'} max-sm:text-base`}
                        >
                          {menu.title}
                        </Link>
                      </li>
                    )
                ))}

              </ul>

              <section className='absolute bottom-10 w-full'>
                <SocialIcons
                  ulClassName='gap-6 [&_svg]:text-2xl [&>li:hover_svg]:text-mustard'
                />
              </section>
            </nav>
          </div>
        ) : (
          <div className="fixed right-0 top-0 w-screen h-screen bg-transparent -z-10 duration-300 pointer-events-none" >
            <nav className="w-7/12 ml-auto bg-neutral-50 h-screen duration-300 transform translate-x-full pt-28 px-12" />
          </div>
        )}
      </div>

    </>
  )
}

export default MobileMenu