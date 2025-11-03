import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Table from '.'
import { BrowserRouter } from 'react-router-dom'



describe('GenomeCatalogue page > Table component', () => {
  const mockMetaData = {
    genome: ['D300418', 'GEXTRA'],
    completeness: [99.49, 99.98],
    contamination: [0.17, 0.35],
    length: [1791036, 2144878],
    domain: ['Bacteria', 'Bacteria'],
    phylum: ['Bacillota_A', 'Actinomycetota'],
    class: ['Clostridia', 'Actinomycetia'],
    order: ['Oscillospirales', 'Actinomycetales'],
    family: ['Ruminococcaceae', 'Bifidobacteriaceae'],
    genus: ['Faeciplasma', 'Bifidobacterium'],
    species: ['Faeciplasma gallinarum', 'Bifidobacterium animalis'],
  }

  const experimentName = 'TestExperiment'


  const renderGenomeCatalogueTable = (props = {}) =>
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Table
          metaData={mockMetaData}
          allError={null}
          experimentName={experimentName}
          {...props}
        />
      </BrowserRouter>
    )


  it('renders table with correct page title and columns', () => {
    renderGenomeCatalogueTable()
    expect(screen.getByText('Genome Metadata')).toBeInTheDocument()
    expect(screen.getByText('Genome')).toBeInTheDocument()
    expect(screen.getByText('Phylum')).toBeInTheDocument()
    expect(screen.getByText('Taxonomy')).toBeInTheDocument()
    expect(screen.getByText('Completeness')).toBeInTheDocument()
    expect(screen.getByText('Contamination')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
  })



  it('renders genome values as links with correct href', () => {
    renderGenomeCatalogueTable()
    const genomeLink = screen.getByRole('link', { name: 'D300418' })
    expect(genomeLink).toHaveAttribute(
      'href',
      `/genome-catalogues/${encodeURIComponent(experimentName)}/D300418`
    )
  })



  it('renders taxonomy cell with tooltip and correct species', async () => {
    renderGenomeCatalogueTable()
    const taxonomyCell = screen.getAllByText('Faeciplasma gallinarum')[1] // 0 would be the one inside the dropdown filter
    expect(taxonomyCell).toBeInTheDocument()
    const tooltip = screen.getAllByTestId('taxonomy-tooltip')[0] // get the first one (the cell with "Faeciplasma gallinarum")
    expect(tooltip).toHaveAttribute(
      'data-tip',
      'Bacteria > Bacillota_A > Clostridia > Oscillospirales > Ruminococcaceae > Faeciplasma > Faeciplasma gallinarum'
    )
  })



  it('renders completeness and contamination with %', () => {
    renderGenomeCatalogueTable()
    expect(screen.getByText('99.49%')).toBeInTheDocument()
    expect(screen.getByText('0.17%')).toBeInTheDocument()
    expect(screen.getByText('99.98%')).toBeInTheDocument()
    expect(screen.getByText('0.35%')).toBeInTheDocument()
  })


  it('renders length values', () => {
    renderGenomeCatalogueTable()
    expect(screen.getByText('1791036')).toBeInTheDocument()
    expect(screen.getByText('2144878')).toBeInTheDocument()
  })




  it('shows error message if allError is provided', () => {
    renderGenomeCatalogueTable({ allError: 'Failed to load data' })
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument()
  })




  it('handles empty metaData gracefully', () => {
    const emptyMetaData = Object.fromEntries(
      Object.keys(mockMetaData).map((k) => [k, []])
    )
    renderGenomeCatalogueTable({ metaData: emptyMetaData })
    expect(screen.getByText('No data was found.')).toBeInTheDocument()
  })
})
