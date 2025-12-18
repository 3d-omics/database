import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Navbar />
      </BrowserRouter>
    )
  }

  it('renders logo with external link', () => {
    renderNavbar()
    const logoLink = screen.getByRole('link', { name: /3D'omics logo/i })
    expect(logoLink).toHaveAttribute('href', 'http://www.3domics.eu')
    expect(logoLink).toHaveAttribute('target', '_blank')
  })

  it('renders Data Portal Home link', () => {
    renderNavbar()
    const homeLink = screen.getByRole('link', { name: /Data Portal Home/i })
    expect(homeLink).toHaveAttribute('href', '/')
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
})