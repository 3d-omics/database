import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Details from '.'
import type { GenomeData } from 'pages/GenomeCatalogue/components/Table'

const mockGenomeData: GenomeData = {
  genome: "TG:bin_000003",
  phylum: "Bacillota",
  completeness: 99.89,
  contamination: 1.77,
  length: 2084398,
  N50: 20549,
  domain: "Bacteria",
  class: "Bacilli",
  order: "Lactobacillales",
  family: "Lactobacillaceae",
  genus: "Limosilactobacillus",
  species: "Limosilactobacillus reuteri_E",
}

describe('Details component', () => {
  it('renders all genome details correctly', () => {
    render(<Details genomeData={mockGenomeData} />)

    expect(screen.getByText('Taxonomic lineage:')).toBeInTheDocument()
    expect(screen.getByText('Bacteria')).toBeInTheDocument()
    expect(screen.getByText('Bacilli')).toBeInTheDocument()
    expect(screen.getByText('Lactobacillales')).toBeInTheDocument()
    expect(screen.getByText('Lactobacillaceae')).toBeInTheDocument()
    expect(screen.getByText('Limosilactobacillus')).toBeInTheDocument()
    expect(screen.getByText('Limosilactobacillus reuteri_E')).toBeInTheDocument()

    expect(screen.getByText('Completeness:')).toBeInTheDocument()
    expect(screen.getByText(/99.89%/)).toBeInTheDocument()

    expect(screen.getByText('Contamination:')).toBeInTheDocument()
    expect(screen.getByText(/1.77%/)).toBeInTheDocument()

    expect(screen.getByText('Length:')).toBeInTheDocument()
    expect(screen.getByText('2084398')).toBeInTheDocument()

    expect(screen.getByText('N50:')).toBeInTheDocument()
    expect(screen.getByText('20549')).toBeInTheDocument()
  })
})