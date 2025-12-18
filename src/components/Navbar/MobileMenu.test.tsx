import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import MobileMenu from './MobileMenu'

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

// Mock SocialIcons
vi.mock('../SocialIcons', () => ({
  default: () => <div data-testid='social-icons'>Social Icons</div>,
}))

describe('MobileMenu', () => {
  const renderMobileMenu = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <MobileMenu />
      </BrowserRouter>
    )
  }

  it('renders hamburger menu', () => {
    renderMobileMenu()
    expect(screen.getByTestId('hamburger-menu')).toBeInTheDocument()
  })

  it('mobile menu is closed by default', () => {
    renderMobileMenu()
    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument()
  })

  it('opens mobile menu when hamburger clicked', async () => {
    const user = userEvent.setup()
    renderMobileMenu()

    const hamburger = screen.getByTestId('hamburger-menu')
    await user.click(hamburger)

    expect(screen.getByTestId('mobile-menu-opened')).toBeInTheDocument()
  })

  it('closes mobile menu when overlay clicked', async () => {
    const user = userEvent.setup()
    renderMobileMenu()

    const hamburger = screen.getByTestId('hamburger-menu')
    await user.click(hamburger)
    expect(screen.getByTestId('mobile-menu-opened')).toBeInTheDocument()

    const overlay = screen.getByTestId('mobile-menu-overlay')
    await user.click(overlay)
    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument()
  })

  it('closes mobile menu when menu link clicked', async () => {
    const user = userEvent.setup()
    renderMobileMenu()

    const hamburger = screen.getByTestId('hamburger-menu')
    await user.click(hamburger)

    const homeLink = screen.getByRole('link', { name: /Data Portal Home/i })
    await user.click(homeLink)

    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument()
  })

  it('renders menu items when opened', async () => {
    const user = userEvent.setup()
    renderMobileMenu()

    const hamburger = screen.getByTestId('hamburger-menu')
    await user.click(hamburger)

    expect(screen.getByRole('link', { name: /Data Portal Home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Animal Trials/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Animal Specimens/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument()
  })

  it('renders SocialIcons when opened', async () => {
    const user = userEvent.setup()
    renderMobileMenu()

    const hamburger = screen.getByTestId('hamburger-menu')
    await user.click(hamburger)

    expect(screen.getByTestId('social-icons')).toBeInTheDocument()
  })

  it('renders 3Domics logo link', async () => {
    const user = userEvent.setup()
    renderMobileMenu()

    const hamburger = screen.getByTestId('hamburger-menu')
    await user.click(hamburger)

    const logoLink = screen.getByRole('link', { name: /3D'omics logo/i })
    expect(logoLink).toHaveAttribute('href', 'http://www.3domics.eu')
  })
})