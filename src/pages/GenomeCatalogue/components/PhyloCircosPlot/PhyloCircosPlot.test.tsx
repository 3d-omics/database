import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PhylogeneticTree, { PhyloData, CircosData } from './index'
import { vi } from 'vitest'


// Mock child components
vi.mock('./PhyloTreeLayer', () => ({
  __esModule: true,
  default: ({ data, width, height }: any) => (
    <g data-testid="phylo-tree-layer" data-width={width} data-height={height}>
      {JSON.stringify(data)}
    </g>
  ),
}))
vi.mock('./CircosLayer', () => ({
  __esModule: true,
  default: ({ phyloData, circosData, width, height }: any) => (
    <g data-testid="circos-layer" data-width={width} data-height={height}>
      {JSON.stringify({ phyloData, circosData })}
    </g>
  ),
}))


describe('GenomeCatalogue page > PhyloCircosPlot component', () => {
  const phyloData: PhyloData = {
    name: 'root',
    children: [
      { name: 'leaf1' },
      { name: 'leaf2', children: [{ name: 'leaf3' }] }
    ]
  }
  const circosData: CircosData = {
    leaf1: { phylum: 'A', completeness: 90, contamination: 1, length: 1000, N50: 500 },
    leaf2: { phylum: 'B', completeness: 80, contamination: 2, length: 2000, N50: 1000 },
    leaf3: { phylum: 'C', completeness: 70, contamination: 3, length: 3000, N50: 1500 }
  }

  it('renders static labels', () => {
    render(<PhylogeneticTree phyloData={phyloData} circosData={circosData} />)
    expect(screen.getByText('Genome size')).toBeInTheDocument()
    expect(screen.getByText('Genome quality')).toBeInTheDocument()
    expect(screen.getByText('Phylum')).toBeInTheDocument()
  })


  it('renders CircosLayer and PhyloTreeLayer with correct props', () => {
    render(<PhylogeneticTree phyloData={phyloData} circosData={circosData} />)
    const circosLayer = screen.getByTestId('circos-layer')
    const phyloTreeLayer = screen.getByTestId('phylo-tree-layer')
    expect(circosLayer).toBeInTheDocument()
    expect(phyloTreeLayer).toBeInTheDocument()
    expect(circosLayer.getAttribute('data-width')).toBe('1000')
    expect(phyloTreeLayer.getAttribute('data-width')).toBe('1000')
  })
})