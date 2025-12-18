import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DownloadDatabaseSchema from './DownloadDatabaseSchema'

describe('DownloadDatabaseSchema', () => {
  const originalCreateElement = document.createElement

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original createElement
    document.createElement = originalCreateElement
  })

  it('renders page header', () => {
    render(<DownloadDatabaseSchema />)
    expect(screen.getByText('Download Database Schema')).toBeInTheDocument()
  })

  it('renders page description', () => {
    render(<DownloadDatabaseSchema />)
    expect(screen.getByText(/database schema provides means/i)).toBeInTheDocument()
  })

  it('renders download button', () => {
    render(<DownloadDatabaseSchema />)
    expect(screen.getByRole('button', { name: /Download JSON file/i })).toBeInTheDocument()
  })

  it('triggers download when button clicked', async () => {
    const user = userEvent.setup()
    
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

    render(<DownloadDatabaseSchema />)

    const downloadButton = screen.getByRole('button', { name: /Download JSON file/i })
    await user.click(downloadButton)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockLink.href).toBe('/database/experiment-hierarchy.json')
    expect(mockLink.download).toBe('3domics_data_schema.json')
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('renders examples section', () => {
    render(<DownloadDatabaseSchema />)
    
    expect(screen.getByText('Examples')).toBeInTheDocument()
    expect(screen.getByText(/List all individual animal IDs/i)).toBeInTheDocument()
  })

  it('renders multiple example commands', () => {
    render(<DownloadDatabaseSchema />)
    
    const jqCommands = screen.getAllByText(/jq/i)
    expect(jqCommands.length).toBeGreaterThan(1)
  })
})