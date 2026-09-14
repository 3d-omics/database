import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import DownloadDatabaseSchema from './DownloadDatabaseSchema'

describe('DownloadDatabaseSchema', () => {
  const originalCreateElement = document.createElement

  const renderPage = () => render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DownloadDatabaseSchema />
    </MemoryRouter>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original createElement
    document.createElement = originalCreateElement
  })

  it('renders page header', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Download Database Schema' })).toBeInTheDocument()
  })

  it('renders page description', () => {
    renderPage()
    expect(screen.getByText(/database schema provides means/i)).toBeInTheDocument()
  })

  it('renders download button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /Download JSON file/i })).toBeInTheDocument()
  })

  it('triggers download when button clicked', async () => {
    const user = userEvent.setup()

    // Render first: the breadcrumb links are <a> elements the mock would replace
    renderPage()

    // Mock only for 'a' elements
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    }

    const createElementSpy = vi.fn((tag: string) => {
      if (tag === 'a') {
        return mockLink
      }
      return originalCreateElement.call(document, tag)
    })

    document.createElement = createElementSpy as any

    const downloadButton = screen.getByRole('button', { name: /Download JSON file/i })
    await user.click(downloadButton)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockLink.href).toBe('/database/experiment-hierarchy.json')
    expect(mockLink.download).toBe('3domics_data_schema.json')
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('renders examples section', () => {
    renderPage()

    expect(screen.getByText('Examples')).toBeInTheDocument()
    expect(screen.getByText(/List all individual animal IDs/i)).toBeInTheDocument()
  })

  it('renders multiple example commands', () => {
    renderPage()

    const jqCommands = screen.getAllByText(/jq/i)
    expect(jqCommands.length).toBeGreaterThan(1)
  })
})
