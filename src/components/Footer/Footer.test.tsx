import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from './index'

describe('Footer', () => {
  beforeEach(() => {
    // Clean up CSS variable
    document.documentElement.style.removeProperty('--footer-height')
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--footer-height')
  })

  const renderFooter = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Footer />
      </BrowserRouter>
    )
  }

  it('renders EU funding text', () => {
    renderFooter()
    expect(screen.getByText(/European Union's Horizon 2020/)).toBeInTheDocument()
  })

  it('renders coordinator link', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /Antton Alberdi/i })
    expect(link).toHaveAttribute('href', 'https://www.alberdilab.dk/')
  })

  it('renders contact email link', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /3d-omics@sund.ku.dk/i })
    expect(link).toHaveAttribute('href', 'mailto:3d-omics@sund.ku.dk')
  })

  it('renders privacy policy link', () => {
    renderFooter()
    const link = screen.getByRole('link', { name: /Data and privacy policy/i })
    expect(link).toHaveAttribute('href', 'https://www.3domics.eu/privacy.html')
  })

  it('sets footer height CSS variable on mount', () => {
    renderFooter()
    const footerHeight = document.documentElement.style.getPropertyValue('--footer-height')
    expect(footerHeight).toBeTruthy()
  })
})