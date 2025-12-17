import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhyloCircosPlot from './index';

// Mock child components
vi.mock('./PhyloTreeLayer', () => ({
  default: () => <g data-testid="phylo-tree-layer">PhyloTree</g>,
}));

vi.mock('./CircosLayer', () => ({
  default: () => <g data-testid="circos-layer">Circos</g>,
}));

describe('PhyloCircosPlot', () => {
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
  };

  const mockCircosData = {
    Genome1: {
      phylum: 'Firmicutes',
      completeness: 95,
      contamination: 2,
      length: 2000000,
      N50: 50000,
    },
  };

  it('renders SVG with correct dimensions', () => {
    render(
      <PhyloCircosPlot phyloData={mockPhyloData} circosData={mockCircosData} />
    );

    const svg = screen.getByTestId('phylo-circos-svg');
    expect(svg).toHaveAttribute('width', '1100');
    expect(svg).toHaveAttribute('height', '1100');
  });


  it('renders labels for genome metrics', () => {
    render(<PhyloCircosPlot phyloData={mockPhyloData} circosData={mockCircosData} />);

    expect(screen.getByText('Genome size')).toBeInTheDocument();
    expect(screen.getByText('Genome quality')).toBeInTheDocument();
    expect(screen.getByText('Phylum')).toBeInTheDocument();
  });

  it('renders CircosLayer component', () => {
    render(<PhyloCircosPlot phyloData={mockPhyloData} circosData={mockCircosData} />);

    expect(screen.getByTestId('circos-layer')).toBeInTheDocument();
  });

  it('renders PhyloTreeLayer component', () => {
    render(<PhyloCircosPlot phyloData={mockPhyloData} circosData={mockCircosData} />);

    expect(screen.getByTestId('phylo-tree-layer')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    const emptyPhyloData = { name: '', children: [] };
    const emptyCircosData = {};

    render(
      <PhyloCircosPlot phyloData={emptyPhyloData} circosData={emptyCircosData} />
    );

    expect(screen.getByTestId('phylo-circos-svg')).toBeInTheDocument();
  });
});