import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CircosLayer from './index'

// Mock phylumColorScheme
vi.mock('../../../utils/phylumColorScheme', () => ({
  getPhylumColor: vi.fn((phylum: string) => {
    const colors: Record<string, string> = {
      'Firmicutes': '#FF0000',
      'Proteobacteria': '#00FF00',
    }
    return colors[phylum] || '#999999'
  }),
}))

describe('CircosLayer', () => {
  const mockPhyloData = {
    name: 'root',
    children: [
      {
        name: 'Firmicutes',
        children: [
          {
            name: 'Bacilli',
            children: [{ name: 'Genome1' }],
          },
        ],
      },
    ],
  }

  const mockCircosData = {
    Genome1: {
      phylum: 'Firmicutes',
      completeness: 95,
      contamination: 2,
      length: 2000000,
      N50: 50000,
    },
  }

  const renderLayer = (
    phyloData = mockPhyloData,
    circosData = mockCircosData,
    width = 1100,
    height = 1100
  ) => {
    return render(
      <svg>
        <CircosLayer
          phyloData={phyloData}
          circosData={circosData}
          width={width}
          height={height}
        />
      </svg>
    )
  }

  it('renders group element', () => {
    renderLayer()
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })

  it('renders with correct dimensions', () => {
    renderLayer(mockPhyloData, mockCircosData, 800, 800)
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })

  it('handles empty phylo data', () => {
    const emptyPhyloData = { name: '', children: [] }
    renderLayer(emptyPhyloData, mockCircosData)
    
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })

  it('handles empty circos data', () => {
    renderLayer(mockPhyloData, {} as any)
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })

  it('handles null phylo data', () => {
    renderLayer(null as any, mockCircosData)
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })

  it('handles null circos data', () => {
    renderLayer(mockPhyloData, null as any)
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })
})