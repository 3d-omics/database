import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PhyloTreeLayer from './index'

// Mock useParams from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ experimentName: 'test-experiment' }),
  }
})

describe('MAGCatalogue page > PhyloCircosPlot > PhyloTreeLayer component', () => {
  const mockData = {
    name: 'root',
    children: [
      { name: 'leaf1' },
      { name: 'leaf2' }
    ]
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })


  it('renders an SVG element with correct width and height', () => {
    render(<PhyloTreeLayer data={mockData} width={1000} height={1000} />)
    const phyloTreeLayer = screen.getByTestId('phylo-tree-layer')
    expect(phyloTreeLayer).toBeInTheDocument()
    expect(phyloTreeLayer).toHaveAttribute('width', '1000')
    expect(phyloTreeLayer).toHaveAttribute('height', '1000')
  })
  


  it('renders without crashing with minimal data', () => {
    render(<PhyloTreeLayer data={{ name: 'root' }} width={1000} height={1000} />)
    const phyloTreeLayer = screen.getByTestId('phylo-tree-layer')
    expect(phyloTreeLayer).toBeInTheDocument()
  })


})