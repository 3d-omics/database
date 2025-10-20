import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from "."
import TestRouter from 'tests/setup/test-utils';

const renderFooter = () => {
  render(
    <TestRouter>
      <Footer />
    </TestRouter>
  )
}


describe('components > Footer', () => {

  it('should render the footer with all expected elements', () => {
    renderFooter()
    const footer = screen.getByRole('contentinfo') // footer itself
    expect(footer).toBeInTheDocument()
    expect(screen.getByAltText('EU flag')).toBeInTheDocument()
    expect(screen.getByText(/European Union's Horizon 2020 Research and Innovation/i)).toBeInTheDocument()
    expect(screen.getByText(/Antton Alberdi/i)).toBeInTheDocument()
    expect(screen.getByText(/3d-omics@sund.ku.dk/i)).toBeInTheDocument()
    expect(screen.getByText(/Data and privacy policy/i)).toBeInTheDocument()
    const socialLinks = screen.getByTestId('social-icons') // Social icons component
    expect(socialLinks).toBeInTheDocument()
  })


  it('the links render correctly and points to the proper URLs', () => {
    renderFooter()
    const coordinatorLink = screen.getByText(/Antton Alberdi/i)
    expect(coordinatorLink).toHaveAttribute('href', 'https://www.alberdilab.dk/')
    const contactLink = screen.getByText(/3d-omics@sund.ku.dk/i)
    expect(contactLink).toHaveAttribute('href', 'mailto:3d-omics@sund.ku.dk')
    const privacyLink = screen.getByText(/Data and privacy policy/i)
    expect(privacyLink).toHaveAttribute('href', 'https://www.3domics.eu/privacy.html')
  })


  it('sets "--footer-height" CSS variable on mount', () => {
    renderFooter()
    const footerHeight = screen.getByRole('contentinfo').offsetHeight.toString()
    const rootStyle = getComputedStyle(document.documentElement)
    expect(rootStyle.getPropertyValue('--footer-height')).toBe(`${footerHeight}px`)
  })

})

