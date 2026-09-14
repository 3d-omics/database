import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BreadCrumbs from './index'

describe('BreadCrumbs', () => {
  const renderBreadCrumbs = (items: { label: string; link?: string }[]) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <BreadCrumbs items={items} />
      </BrowserRouter>
    )
  }

  it('renders all breadcrumb items', () => {
    const items = [
      { label: 'Home', link: '/' },
      { label: 'List', link: '/list' },
      { label: 'Details' },
    ]

    renderBreadCrumbs(items)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('renders links for items with link property', () => {
    const items = [
      { label: 'Home', link: '/' },
      { label: 'List', link: '/list' },
    ]

    renderBreadCrumbs(items)

    const homeLink = screen.getByRole('link', { name: /Home/i })
    const listLink = screen.getByRole('link', { name: /list/i })

    expect(homeLink).toHaveAttribute('href', '/')
    expect(listLink).toHaveAttribute('href', '/list')
  })

  it('renders text without link for items without link property', () => {
    const items = [
      { label: 'Home', link: '/' },
      { label: 'Current Page' },
    ]

    renderBreadCrumbs(items)

    const currentPage = screen.getByText('Current Page')
    expect(currentPage.tagName).toBe('SPAN')
    expect(currentPage).toHaveClass('font-semibold')
  })

  it('marks only the last item as the current page', () => {
    const items = [
      { label: 'Home', link: '/' },
      { label: 'Section' },
      { label: 'Current Page' },
    ]

    renderBreadCrumbs(items)

    expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Section')).not.toHaveAttribute('aria-current')
    expect(screen.getByText('Section')).not.toHaveClass('font-semibold')
  })

  it('separates the items with a triangle', () => {
    const items = [
      { label: 'Home', link: '/' },
      { label: 'List', link: '/list' },
      { label: 'Details' },
    ]

    renderBreadCrumbs(items)

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav.querySelectorAll('.clip-triangle')).toHaveLength(2)
  })

  it('renders home icon for Data Portal Home', () => {
    const items = [{ label: 'Data Portal Home', link: '/' }]

    renderBreadCrumbs(items)

    // The text version exists (hidden on mobile)
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
  })

  it('renders empty breadcrumbs with empty array', () => {
    renderBreadCrumbs([])

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })
})