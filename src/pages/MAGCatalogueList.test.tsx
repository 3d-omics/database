import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MAGCatalogueList from './MAGCatalogueList'

// Mock data
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        Name: 'Experiment G',
        ID: 'EXP001',
        'MAG catalogue - Number of MAGs': 500,
        'MAG catalogue - Average completeness (%)': 95.5,
        'MAG catalogue - Average contamination (%)': 2.3,
        'MAG catalogue - New species (%)': 15.7,
      },
    },
    {
      id: '2',
      fields: {
        Name: 'Experiment H',
        ID: 'EXP002',
        'MAG catalogue - Number of MAGs': 300,
      },
    },
    {
      id: '3',
      fields: {
        Name: 'M - Histomonas experiment (turkey)',
        ID: 'M',
      },
    },
  ],
}))

vi.mock('assets/data/airtable/experimentswithgenomeinfo.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        ID: 'EXP001',
        link: 'https://example.com/genomes',
        doi: '10.1234/example.doi',
      },
    },
    {
      id: '2',
      fields: {
        ID: 'EXP002',
      },
    },
  ],
}))

describe('MAGCatalogueList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MAGCatalogueList />
      </BrowserRouter>
    )
  }

  // The block of the trial headed by `name`
  const getBlock = (name: string | RegExp) =>
    screen.getAllByRole('listitem').find((item) => within(item).queryByRole('heading', { level: 2, name }))!

  it('renders page header', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'MAG Catalogues' })).toBeInTheDocument()
  })

  it('renders page description', () => {
    renderPage()
    expect(screen.getByText(/Metagenome-assembled genome/i)).toBeInTheDocument()
  })

  it('renders all experiments', () => {
    renderPage()

    expect(screen.getByText('Experiment G')).toBeInTheDocument()
    expect(screen.getByText('Experiment H')).toBeInTheDocument()
  })

  it('renders links to MAG catalogue pages', () => {
    renderPage()

    const linkG = screen.getByRole('link', { name: /Experiment G/i })
    expect(linkG).toHaveAttribute('href', '/mag-catalogues/Experiment%20G')

    const linkH = screen.getByRole('link', { name: /Experiment H/i })
    expect(linkH).toHaveAttribute('href', '/mag-catalogues/Experiment%20H')
  })

  it('displays MAG statistics when available', () => {
    renderPage()

    expect(screen.getByText('500')).toBeInTheDocument() // Number of MAGs
    expect(screen.getByText('95.50%')).toBeInTheDocument() // Average completeness
    expect(screen.getByText('2.30%')).toBeInTheDocument() // Average contamination
    expect(screen.getByText('15.7%')).toBeInTheDocument() // New species
  })

  it('heads a trial named after its ID with the ID, then the rest of the name', () => {
    renderPage()

    const heading = screen.getByRole('heading', { level: 2, name: 'Trial M — Histomonas experiment (turkey)' })
    expect(within(heading).getByRole('link')).toHaveAttribute('href', '/mag-catalogues/M%20-%20Histomonas%20experiment%20(turkey)')
  })

  it('tags a catalogue with the host named in its trial', () => {
    renderPage()

    const trialM = getBlock(/Trial M/)
    expect(within(trialM).getByText('turkey')).toBeInTheDocument()
  })

  it('offers a button to browse each catalogue', () => {
    renderPage()

    const buttons = screen.getAllByRole('link', { name: /Browse catalogue/ })
    expect(buttons.map((button) => button.getAttribute('href'))).toEqual([
      '/mag-catalogues/Experiment%20G',
      '/mag-catalogues/Experiment%20H',
      '/mag-catalogues/M%20-%20Histomonas%20experiment%20(turkey)',
    ])
  })

  it('offers a download button when a link is available', () => {
    renderPage()

    const link = screen.getByRole('link', { name: /Download/ })
    expect(link).toHaveAttribute('href', 'https://example.com/genomes')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('displays DOI when available', () => {
    renderPage()

    expect(screen.getByText('10.1234/example.doi')).toBeInTheDocument()
  })

  it('handles missing statistics gracefully', () => {
    renderPage()

    // Experiment H has only Number of MAGs; the others are shown as dashes
    const experimentH = getBlock('Experiment H')
    expect(within(experimentH).getByText('300')).toBeInTheDocument()
    expect(within(experimentH).getAllByText('—')).toHaveLength(3)
  })

  it('handles missing link and DOI gracefully', () => {
    renderPage()

    // Experiment H has no link or DOI, but should still render
    expect(screen.getByText('Experiment H')).toBeInTheDocument()
  })

  it('formats figures as on a catalogue page: two decimals, and at most two for new species', () => {
    renderPage()

    expect(screen.getByText('95.50%')).toBeInTheDocument()
    expect(screen.getByText('2.30%')).toBeInTheDocument()
    expect(screen.getByText('15.7%')).toBeInTheDocument()
  })
})