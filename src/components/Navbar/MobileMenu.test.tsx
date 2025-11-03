import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TestRouter from "tests/setup/test-utils"
import { fireEvent } from '@testing-library/react'
import MobileMenu from './MobileMenu'


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn()
  }
})
const { useLocation } = await import('react-router-dom')
const mockUseLocation = useLocation as jest.Mock


const renderMobileMenu = () => {
  render(
    <TestRouter>
      <MobileMenu />
    </TestRouter>
  )
}


describe('components > MobileMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ pathname: '/' })
  })


  it('should toggle mobile menu visibility when hamburger is clicked', () => {
    renderMobileMenu()
    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument() // Initially menu should be closed
    const hamburger = screen.getByTestId('hamburger-menu')
    fireEvent.click(hamburger) // Click hamburger menu
    expect(screen.getByTestId('mobile-menu-opened')).toBeInTheDocument()  // Menu should be open
    fireEvent.click(hamburger) // Click hamburger again
    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument() // Menu should be closed again
  })



  it('should render all menu items from the menus array', () => {
    renderMobileMenu()
    expect(screen.queryByText(/animal trial\/experiment/i)).not.toBeInTheDocument() // Check if menu items are not rendered before opening the menu
    expect(screen.queryByText(/animal specimen/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/intestinal section sample/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('hamburger-menu')) // Open the menu
    expect(screen.getByText(/animal trial\/experiment/i)).toBeInTheDocument() // Check if menu items are rendered
    expect(screen.getByText(/animal specimen/i)).toBeInTheDocument()
    expect(screen.getByText(/intestinal section sample/i)).toBeInTheDocument()
    expect(screen.getByText(/home/i)).toHaveAttribute('href', '/') // Check if links have correct hrefs
    expect(screen.getByText(/animal trial\/experiment/i)).toHaveAttribute('href', '/animal-trial-experiment')
    expect(screen.getByText(/animal specimen/i)).toHaveAttribute('href', '/animal-specimen')
    expect(screen.getByText(/intestinal section sample/i)).toHaveAttribute('href', '/intestinal-section-sample')
    expect(screen.getByText(/metabolomics/i)).toHaveAttribute('href', '/metabolomics')
    expect(screen.getByText(/cryosection/i)).toHaveAttribute('href', '/cryosection')
    expect(screen.getByText(/microsample/i)).toHaveAttribute('href', '/microsample')
    expect(screen.getAllByText(/genome composition/i)[0]).toHaveAttribute('href', '/macrosample-composition')
    expect(screen.getAllByText(/genome composition/i)[1]).toHaveAttribute('href', '/microsample-composition')
  })



  it('should highlight the current location with mustard text color', () => {
    mockUseLocation.mockReturnValue({ pathname: '/animal-specimen' })
    renderMobileMenu()
    fireEvent.click(screen.getByTestId('hamburger-menu')) // Open the menu
    expect(screen.getByText(/animal specimen/i)).toHaveClass('text-mustard')
    expect(screen.getByText(/animal trial\/experiment/i)).not.toHaveClass('text-mustard')
  })




  it('should stop click propagation when clicking on the nav element', () => {
    renderMobileMenu()
    fireEvent.click(screen.getByTestId('hamburger-menu'))
    const navElement = screen.getByTestId('mobile-menu-opened')
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    const stopPropagationMock = vi.fn()
    Object.defineProperty(clickEvent, 'stopPropagation', {  // Patch the event
      value: stopPropagationMock,
      writable: true,
    })
    navElement.dispatchEvent(clickEvent)
    expect(stopPropagationMock).toHaveBeenCalled()
  })




  it('should close the menu when clicking outside the menu area', () => {
    renderMobileMenu()
    fireEvent.click(screen.getByTestId('hamburger-menu'))
    expect(screen.getByTestId('mobile-menu-opened')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('mobile-menu-overlay')) // Click outside the menu (clicking on the backdrop overlay)
    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument()
  })




  it('should render SocialIcons component only after mobile menu is opened', () => {
    renderMobileMenu()
    expect(screen.queryByTestId('social-icons')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('hamburger-menu'))
    expect(screen.getByTestId('social-icons')).toBeInTheDocument()
  })

})
