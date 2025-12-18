import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import MetabolomicsList from './MetabolomicsList'

// Mock data
vi.mock('assets/data/airtable/experimentswithgenomeinfo.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        Name: 'Experiment G',
        ID: 'G',
      },
    },
    {
      id: '2',
      fields: {
        Name: 'Experiment H',
        ID: 'H',
      },
    },
  ],
}))

// Mock Excel files
vi.mock('assets/data/metabolomics/metabolomics_G.xlsx', () => ({ default: 'mock-file-g.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_H.xlsx', () => ({ default: 'mock-file-h.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_I.xlsx', () => ({ default: 'mock-file-i.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_J.xlsx', () => ({ default: 'mock-file-j.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_K.xlsx', () => ({ default: 'mock-file-k.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_M.xlsx', () => ({ default: 'mock-file-m.xlsx' }))

describe('MetabolomicsList', () => {
  const originalCreateElement = document.createElement
  const originalAppendChild = document.body.appendChild
  const originalRemoveChild = document.body.removeChild

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.createElement = originalCreateElement
    document.body.appendChild = originalAppendChild
    document.body.removeChild = originalRemoveChild
  })

  const renderPage = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MetabolomicsList />
      </BrowserRouter>
    )
  }

  it('renders page header', () => {
    renderPage()
    expect(screen.getByText('Metabolomics')).toBeInTheDocument()
  })

  it('renders page description', () => {
    renderPage()
    expect(screen.getByText(/Metabolic landscapes of the intestine/i)).toBeInTheDocument()
  })

  it('renders all experiments', () => {
    renderPage()

    expect(screen.getByText('Experiment G')).toBeInTheDocument()
    expect(screen.getByText('Experiment H')).toBeInTheDocument()
  })

  it('renders links to experiment overview', () => {
    renderPage()

    const linkG = screen.getByRole('link', { name: /Experiment G/i })
    expect(linkG).toHaveAttribute('href', '/animal-trials/Experiment G')
  })

  it('renders volcano plot links', () => {
    renderPage()

    const volcanoLinks = screen.getAllByRole('link', { name: /Volcano Plot/i })
    expect(volcanoLinks).toHaveLength(2)
    expect(volcanoLinks[0]).toHaveAttribute('href', '/metabolomics/volcano/Experiment%20G')
    expect(volcanoLinks[1]).toHaveAttribute('href', '/metabolomics/volcano/Experiment%20H')
  })

  it('renders heatmap links', () => {
    renderPage()

    const heatmapLinks = screen.getAllByRole('link', { name: /Heatmap/i })
    expect(heatmapLinks).toHaveLength(2)
    expect(heatmapLinks[0]).toHaveAttribute('href', '/metabolomics/heatmap/Experiment%20G')
    expect(heatmapLinks[1]).toHaveAttribute('href', '/metabolomics/heatmap/Experiment%20H')
  })

  it('renders download buttons', () => {
    renderPage()

    expect(screen.getByText(/Download Excel File for experiment G/i)).toBeInTheDocument()
    expect(screen.getByText(/Download Excel File for experiment H/i)).toBeInTheDocument()
  })

  it('triggers download when download button clicked', async () => {
    const user = userEvent.setup()

    const mockLink = originalCreateElement.call(document, 'a') as HTMLAnchorElement
    mockLink.addEventListener('click', (e) => e.preventDefault())
    const clickSpy = vi.spyOn(mockLink, 'click')

    const createElementSpy = vi.fn((tag: string) => {
      if (tag === 'a') {
        return mockLink
      }
      return originalCreateElement.call(document, tag)
    })

    document.createElement = createElementSpy as any

    renderPage()

    const downloadButton = screen.getByRole('button', { name: /Download Excel File for experiment G/i })
    await user.click(downloadButton)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockLink.href).toContain('mock-file-g.xlsx')
    expect(mockLink.download).toBe('metabolite-data-experiment-G.xlsx')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('renders download icon', () => {
    renderPage()

    const icons = screen.getAllByTestId('download-tsv-icon')
    expect(icons).toHaveLength(2)
  })
})