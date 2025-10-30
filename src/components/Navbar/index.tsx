import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import MobileMenu from './MobileMenu'
import { menus } from './MenuItems'
import Logo from 'src/assets/images/3domics-logo.png'

const Navbar = () => {

  const location = useLocation().pathname
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
      className='bg-neutral-50 shadow-md flex items-center py-2 px-8 !sticky top-0 z-40 max-md:px-6 max-sm:px-4'
      data-cy='navbar'
      data-testid='desktop-navbar'
      ref={navbarRef}
    >
      <div className="flex-1">
        <Link to={'/'} className="btn btn-ghost text-xl max-lg:px-2"> 
          <img src={Logo} alt="3d'omics logo" className="h-10 object-contain" data-cy='3domics-logo' />
        </Link>
      </div>

      <div className='flex items-center max-lg:hidden'>
        <ul className="flex items-center gap-7 text-xs font-semibold px-10">
          {menus.map((menu) => (
            menu.sectionTitle
              ? (
                <li
                  className={`relative w-fit [&>ul]:hover:max-h-[300px] [&>ul]:hover:duration-300`}
                  key={menu.sectionTitle}
                  data-testid={`parentmenu-${menu.sectionTitle?.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {menu.sectionTitle}
                  <ul className='absolute top-full px-4 duration-300 overflow-hidden max-h-0 bg-white rounded-md mt-3 -ml-4 shadow-2xl [&>li]:py-3 whitespace-nowrap'>
                    {menu.subMenus.map((subMenu) => (
                      <li
                        className={`hover:text-mustard ${location === subMenu.location && 'text-mustard'}`}
                        key={subMenu.title}
                        data-testid={`submenu-${subMenu.title?.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <Link to={subMenu.location}>{subMenu.title}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li
                  className={`hover:text-mustard ${location === menu.location && 'text-mustard'}`}
                  key={menu.title}
                  data-testid={`parentmenu-${menu.title?.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <Link to={menu.location ?? '/'}>{menu.title}</Link>
                </li>
              )
          ))}
        </ul>

      </div>

      <MobileMenu />

    </nav>
  )
}

export default Navbar
