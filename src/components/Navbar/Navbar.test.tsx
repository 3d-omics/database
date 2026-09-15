import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './index'

// Mock MenuItems
vi.mock('./MenuItems', () => ({
  menus: [
    {
      sectionTitle: 'Data',
      subMenus: [
        { title: 'Animal Trials', location: '/animal-trials' },
        { title: 'Animal Specimens', location: '/animal-specimens' },
      ],
    },
    {
      title: 'About',
      location: '/about',
    },
  ],
}))

// Mock MobileMenu
vi.mock('./MobileMenu', () => ({
  default: () => <div data-testid='mobile-menu'>Mobile Menu</div>,
}))

describe('Navbar', () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty('--navbar-height')
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--navbar-height')
  })

  const renderNavbar = (initialRoute = '/') => {
    return render(
      <MemoryRouter
        initialEntries={[initialRoute]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Navbar />
      </MemoryRouter>
    )
  }

  it('renders logo with external link', () => {
    renderNavbar()
    const logoLink = screen.getByRole('link', { name: /3D'omics logo/i })
    expect(logoLink).toHaveAttribute('href', 'http://www.3domics.eu')
    expect(logoLink).toHaveAttribute('target', '_blank')
  })

  it('renders the Data portal tag as the home link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Data portal' })).toHaveAttribute('href', '/')
  })

  it('sets navbar height CSS variable on mount', () => {
    renderNavbar()
    const navbarHeight = document.documentElement.style.getPropertyValue('--navbar-height')
    expect(navbarHeight).toBeTruthy()
  })

  it('renders parent menu items', () => {
    renderNavbar()
    expect(screen.getByTestId('parentmenu-data')).toBeInTheDocument()
    expect(screen.getByTestId('parentmenu-about')).toBeInTheDocument()
  })

  it('renders submenu items', () => {
    renderNavbar()
    expect(screen.getByTestId('submenu-animal-trials')).toBeInTheDocument()
    expect(screen.getByTestId('submenu-animal-specimens')).toBeInTheDocument()
  })

  it('renders menu item without submenus', () => {
    renderNavbar()
    const aboutLink = screen.getByRole('link', { name: /About/i })
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('renders MobileMenu component', () => {
    renderNavbar()
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
  })

  it('renders the desktop theme toggle', () => {
    renderNavbar()
    expect(screen.getByRole('button', { name: 'Theme: light' })).toBeInTheDocument()
  })

  it('marks the page that is open', () => {
    renderNavbar('/about')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Data portal' })).not.toHaveAttribute('aria-current')
  })

  it('keeps an entry marked on the pages below it', () => {
    renderNavbar('/about/team')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks the home link on the home page alone', () => {
    renderNavbar('/')
    expect(screen.getByRole('link', { name: 'Data portal' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
  })

  it('opens each dropdown from a button, so keyboard focus can reach it', () => {
    renderNavbar()
    expect(screen.getByRole('button', { name: 'Data' })).toBeInTheDocument()
  })

  it('marks a dropdown while one of its pages, or a page below one, is open', () => {
    renderNavbar('/animal-specimens/SPEC-1')
    expect(screen.getByRole('button', { name: 'Data' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: 'Animal Specimens' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Animal Trials' })).not.toHaveAttribute('aria-current')
  })

  it('leaves a dropdown unmarked on other pages', () => {
    renderNavbar('/about')
    expect(screen.getByRole('button', { name: 'Data' })).not.toHaveAttribute('aria-current')
  })
})
