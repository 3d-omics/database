import { render, screen } from '@testing-library/react';
import CircosLayer from '.'

const mockPhyloData = {
  name: 'root',
  children: [
    {
      name: 'A',
      phylum: 'Actinomycetota',
      children: []
    },
    {
      name: 'B',
      phylum: 'Bacillota',
      children: []
    }
  ]
}

const mockCircosData = {
  A: {
    phylum: 'Actinomycetota',
    completeness: 95,
    contamination: 2,
    length: 50
  },
  B: {
    phylum: 'Bacillota',
    completeness: 80,
    contamination: 5,
    length: 100
  }
}

const mockPhyloData2 = {
  name: 'root',
  children: [
    {
      name: 'A',
      phylum: 'Actinomycetota',
      children: []
    },
    {
      name: 'B',
      phylum: 'Bacillota',
      children: []
    },
    {
      name: 'C',
      phylum: 'Bacillota_A',
      children: []
    }
  ]
}

const mockCircosData2 = {
  A: {
    phylum: 'Actinomycetota',
    completeness: 95,
    contamination: 2,
    length: 50
  },
  B: {
    phylum: 'Bacillota',
    completeness: 80,
    contamination: 5,
    length: 100
  },
  C: {
    phylum: 'Bacillota_A',
    completeness: 92,
    contamination: 1,
    length: 20
  }
}

describe('GenomeCatalogue page > PhyloCircosPlot > CircosLayer component', () => {

  it('renders an SVG group element', () => {
    render(
      <svg>
        <CircosLayer
          phyloData={mockPhyloData as any}
          circosData={mockCircosData as any}
          width={1000}
          height={1000}
        />
      </svg>
    )
    expect(screen.getByTestId('circos-layer')).toBeInTheDocument()
  })



  it('renders circos arcs for each leaf and metric', () => {
    render(
      <svg>
        <CircosLayer
          phyloData={mockPhyloData as any}
          circosData={mockCircosData as any}
          width={1000}
          height={1000}
        />
      </svg>
    )
    expect(screen.getAllByTestId('circos-path')).toHaveLength(6) // 2 leaves (A, B) * 3 metrics (Phylum, Genome quality, Genome size) = 6 paths
  })




  it('applies correct fill color for phylum metric', () => {
    render(
      <svg>
        <CircosLayer
          phyloData={mockPhyloData as any}
          circosData={mockCircosData as any}
          width={1000}
          height={1000}
        />
      </svg>
    )
    // The paths correspond to the phylum metric
    const paths = screen.getAllByTestId('circos-path')
    expect(paths[0].getAttribute('fill')).toBe('#C7243A') // paths[1] would be the Genome quality color for A, and paths[2] would be the Genome size color for A
    expect(paths[3].getAttribute('fill')).toBe('#EDAD0B')
  })




  it('removes previous content on rerender', () => {
    const {rerender } = render(
      <svg>
        <CircosLayer
          phyloData={mockPhyloData as any}
          circosData={mockCircosData as any}
          width={1000}
          height={1000}
        />
      </svg>
    )
    rerender(
      <svg>
        <CircosLayer
          phyloData={mockPhyloData2 as any}
          circosData={mockCircosData2 as any}
          width={1000}
          height={1000}
        />
      </svg>
    )
    // Should still have 6 paths after rerender
    expect(screen.getAllByTestId('circos-path')).toHaveLength(9)
  })


})