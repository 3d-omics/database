import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from "."
import TestRouter from "tests/setup/test-utils"
import { fireEvent } from '@testing-library/react'


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn()
  }
})
const { useLocation, useNavigate } = await import('react-router-dom')
const mockUseLocation = useLocation as jest.Mock
const mockUseNavigate = useNavigate as jest.Mock
const mockNavigate = vi.fn()



const renderNavbar = () => {
  render(
    <TestRouter>
      <Navbar />
    </TestRouter>
  )
}



describe('components > Navbar', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ pathname: '/' })
    mockUseNavigate.mockReturnValue(mockNavigate)
  })

  it('should render the logo and navigation links correctly', () => {
    renderNavbar()
    expect(screen.getByAltText("3d'omics logo")).toBeInTheDocument()
    const experimentElements = screen.getAllByText('Animal Trial/Experiment')
    expect(experimentElements).toHaveLength(2)
    expect(screen.getByText(/animal specimen/i)).toBeInTheDocument()
    expect(screen.getByText(/cryosection/i)).toBeInTheDocument()
    const intestinalElements = screen.getAllByText(/intestinal section sample/i)
    expect(intestinalElements).toHaveLength(2) // One section title, one submenu item
    const microsampleElements = screen.getAllByText(/microsample/i)
    expect(microsampleElements).toHaveLength(2) // One section title, one submenu item
    expect(screen.getByText(/metabolomics/i)).toBeInTheDocument()
    const genomeCompositionElements = screen.getAllByText(/genome composition/i)
    expect(genomeCompositionElements).toHaveLength(2) // One for macrosample, one for microsample
  })


  it('should highlight menu item based on current location', () => {
    mockUseLocation.mockReturnValue({ pathname: '/animal-specimen' })
    renderNavbar()
    const highlightedMenuItem = screen.getByTestId('parentmenu-animal-specimen')
    expect(highlightedMenuItem).toHaveClass('text-mustard')
    const notHighlightedMenuItem = screen.getByTestId('parentmenu-cryosection')
    expect(notHighlightedMenuItem).not.toHaveClass('text-mustard')
  })



  it('should highlight submenu item based on current location2', () => {
    mockUseLocation.mockReturnValue({ pathname: '/metabolomics' })
    renderNavbar()
    const highlightedMenuItem2 = screen.getByTestId('submenu-metabolomics')
    expect(highlightedMenuItem2).toHaveClass('text-mustard')
    const notHighlightedMenuItem2 = screen.getByTestId('submenu-microsample')
    expect(notHighlightedMenuItem2).not.toHaveClass('text-mustard')
  })



  it('should display dropdown menus on hover for items with submenus', async () => {
    renderNavbar()
    const parentMenu = screen.getByTestId('parentmenu-intestinal-section-sample')
    fireEvent.mouseOver(parentMenu)
    const submenu = await screen.findByTestId('submenu-intestinal-section-sample')
    const submenu2 = await screen.findByTestId('submenu-metabolomics')
    expect(submenu).toBeVisible()
    expect(submenu2).toBeVisible()
  })



  // it('should display search input when search icon is clicked, and close when close icon is clicked', () => {
  //   renderNavbar()
  //   expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
  //   fireEvent.click(screen.getByTestId('open-search-input-icon')) // Open search input
  //   expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  //   fireEvent.click(screen.getByTestId('close-search-input-icon')) // Close search input
  //   expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
  // })




  // it('should navigate to search page when search button is clicked', () => {
  //   renderNavbar()
  //   fireEvent.click(screen.getByTestId('open-search-input-icon')) // Open search input
  //   const searchInput = screen.getByPlaceholderText('Search...')
  //   fireEvent.change(searchInput, { target: { value: 'test query' } }) // Type in search query
  //   fireEvent.click(screen.getByTestId('perform-search-icon')) // Click search button
  //   expect(mockNavigate).toHaveBeenCalledWith('/search?keyword=test query')
  // })



  // it('should navigate to search page with keyword when Enter key is pressed', () => {
  //   renderNavbar()
  //   fireEvent.click(screen.getByTestId('open-search-input-icon')) // Open search input
  //   const input = screen.getByPlaceholderText('Search...')
  //   fireEvent.change(input, { target: { value: 'test query2' } })
  //   fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  //   expect(mockNavigate).toHaveBeenCalledWith('/search?keyword=test query2')
  // })



  it('should open mobile menu when hamburger icon is clicked', async () => {
    renderNavbar()
    expect(screen.queryByTestId('mobile-menu-opened')).not.toBeInTheDocument()
    const hamburgerIcon = screen.getByTestId('hamburger-menu')
    fireEvent.click(hamburgerIcon)
    expect(screen.getByTestId('mobile-menu-opened')).toHaveClass('translate-x-0')
  })

})
