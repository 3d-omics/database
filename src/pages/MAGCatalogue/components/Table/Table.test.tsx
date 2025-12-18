import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MAGCatalogueTable from './index'

// Mock TableView
vi.mock('components/TableView', () => ({
  default: ({ data, columns, pageTitle }: any) => (
    <div data-testid='table-view'>
      <h1>{pageTitle}</h1>
      <div data-testid='data-length'>{data.length}</div>
      <div data-testid='columns-length'>{columns.length}</div>
    </div>
  ),
}))

describe('MAGCatalogueTable', () => {
  const mockMetaData = {
    genome: ['Genome1', 'Genome2', 'Genome3'],
    phylum: ['Firmicutes', 'Proteobacteria', 'Firmicutes'],
    completeness: [95, 98, 92],
    contamination: [2, 1, 3],
    length: [2000000, 4500000, 1800000],
    domain: ['Bacteria', 'Bacteria', 'Bacteria'],
    class: ['Bacilli', 'Gammaproteobacteria', 'Bacilli'],
    order: ['Lactobacillales', 'Enterobacterales', 'Lactobacillales'],
    family: ['Lactobacillaceae', 'Enterobacteriaceae', 'Lactobacillaceae'],
    genus: ['Lactobacillus', 'Escherichia', 'Lactobacillus'],
    species: ['L_acidophilus', 'E_coli', 'L_casei'],
  }

  const renderTable = (metaData = mockMetaData, experimentName = 'Experiment G') => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
        <MAGCatalogueTable metaData={metaData} experimentName={experimentName} />
      </BrowserRouter>
    )
  }

  it('renders TableView with correct title', () => {
    renderTable()
    expect(screen.getByText('MAG Metadata')).toBeInTheDocument()
  })

  it('transforms metadata into correct number of data rows', () => {
    renderTable()
    expect(screen.getByTestId('data-length')).toHaveTextContent('3')
  })

  it('creates correct number of columns', () => {
    renderTable()
    // genome, phylum, taxonomy, completeness, contamination, length = 6 columns
    expect(screen.getByTestId('columns-length')).toHaveTextContent('6')
  })

  it('handles empty metadata', () => {
    const emptyMetaData = {
      genome: [],
      phylum: [],
      completeness: [],
      contamination: [],
      length: [],
      domain: [],
      class: [],
      order: [],
      family: [],
      genus: [],
      species: [],
    }

    renderTable(emptyMetaData)
    expect(screen.getByTestId('data-length')).toHaveTextContent('0')
  })
})