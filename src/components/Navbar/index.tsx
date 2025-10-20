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

  // const [searchOpen, setSearchOpen] = useState(false)
  // const [globalFilterKeyword, setGlobalFilterKeyword] = useState<string>('')
  // const navigate = useNavigate()

  // const handleSearch = () => {
  //   navigate(`/search?keyword=${globalFilterKeyword.trim()}`)
  // }

  // const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') handleSearch()
  // }

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


        {/* ⬇️ For search across different tables, but does NOT include metabolites nor genomes */}
        {/* <div className={`duration-300 ${searchOpen ? 'w-[200px]' : 'w-0'}`}>
          {searchOpen
            ? <label className='border-b-1.5 flex'>
              <input
                type="text"
                placeholder="Search..."
                className='bg-transparent outline-none text-xs py-0.5 px-1 w-full'
                onChange={(e) => setGlobalFilterKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>
            : <div className='border-b-1.5 w-full mt-5'></div>
          }
        </div>

        {searchOpen
          ? (
            <>
              <button className='btn btn-sm btn-ghost btn-circle'
                onClick={handleSearch}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} data-cy='search-icon-when-open' data-testid='perform-search-icon' title="search" />
              </button>
              <button className='btn btn-sm btn-ghost btn-circle' title='close search box'>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  onClick={() => {
                    setGlobalFilterKeyword('')
                    setSearchOpen(false)
                  }}
                  data-cy='close-search-input'
                  data-testid='close-search-input-icon'
                />
              </button>
            </>
          ) : (
            <button className='btn btn-sm btn-ghost btn-circle' onClick={() => setSearchOpen(true)}>
              <FontAwesomeIcon icon={faMagnifyingGlass} data-cy='search-icon-when-closed' data-testid='open-search-input-icon' title="open search input" />
            </button>
          )
        } */}


      </div>

      <MobileMenu />

    </nav>
  )
}

export default Navbar
