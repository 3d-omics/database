import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PageHeader from './index'

describe('PageHeader', () => {
  const renderHeader = (children?: React.ReactNode) => render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PageHeader
        title='Animal Trials'
        breadcrumbs={[
          { label: 'Data Portal Home', link: '/' },
          { label: 'Trials' },
        ]}
      >
        {children}
      </PageHeader>
    </MemoryRouter>
  )

  it('renders the breadcrumb trail inside the banner', () => {
    renderHeader()
    const trail = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(trail).toHaveTextContent('Trials')
    expect(screen.getByRole('banner')).toContainElement(trail)
  })

  it('renders the title as the page heading inside the banner', () => {
    renderHeader()
    const heading = screen.getByRole('heading', { level: 1, name: 'Animal Trials' })
    expect(screen.getByRole('banner')).toContainElement(heading)
  })

  it('renders the introduction on the banner', () => {
    renderHeader(<p>About the trials</p>)
    expect(screen.getByRole('banner')).toHaveTextContent('About the trials')
  })

  it('leaves out the introduction when there is none', () => {
    renderHeader()
    // The trail and the title alone
    expect(screen.getByRole('banner').children).toHaveLength(2)
  })

  it('names the browser tab after the title alone below the home page', () => {
    renderHeader()
    expect(document.title).toBe("Animal Trials | 3D'omics Data Portal")
  })

  it('names the browser tab after the title and the level above it deeper down', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PageHeader
          title='Volcano Plot'
          breadcrumbs={[
            { label: 'Data Portal Home', link: '/' },
            { label: 'Metabolomics', link: '/metabolomics' },
            { label: 'G - Test Experiment' },
            { label: 'Volcano Plot' },
          ]}
        />
      </MemoryRouter>
    )
    expect(document.title).toBe("Volcano Plot - G - Test Experiment | 3D'omics Data Portal")
  })
})
