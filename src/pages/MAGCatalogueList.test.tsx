import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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

  it('renders page header', () => {
    renderPage()
    expect(screen.getByText('List of MAG Catalogues')).toBeInTheDocument()
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
    expect(screen.getByText('15.70%')).toBeInTheDocument() // New species
  })

  it('displays link when available', () => {
    renderPage()

    const link = screen.getByRole('link', { name: /https:\/\/example.com\/genomes/i })
    expect(link).toHaveAttribute('href', 'https://example.com/genomes')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('displays DOI when available', () => {
    renderPage()

    expect(screen.getByText('10.1234/example.doi')).toBeInTheDocument()
  })

  it('handles missing statistics gracefully', () => {
    renderPage()

    // Experiment H has only Number of MAGs
    expect(screen.getByText('300')).toBeInTheDocument()
    // Should not crash or show undefined
  })

  it('handles missing link and DOI gracefully', () => {
    renderPage()

    // Experiment H has no link or DOI, but should still render
    expect(screen.getByText('Experiment H')).toBeInTheDocument()
  })

  it('formats percentages to 2 decimal places', () => {
    renderPage()

    expect(screen.getByText('95.50%')).toBeInTheDocument()
    expect(screen.getByText('2.30%')).toBeInTheDocument()
    expect(screen.getByText('15.70%')).toBeInTheDocument()
  })
})