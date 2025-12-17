import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PhyloTreeLayer from './index';

// Mock phylumColors only
vi.mock('../../../utils/phylumColorScheme', () => ({
  phylumColors: {
    Firmicutes: '#FF0000',
    Proteobacteria: '#00FF00',
  },
}));

describe('PhyloTreeLayer', () => {
  const mockData = {
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

  const renderLayer = (data = mockData, width = 1100, height = 1100) => {
    return render(
      <MemoryRouter
        initialEntries={['/mag-catalogues/Experiment G']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
        <Routes>
          <Route path="/mag-catalogues/:experimentName" element={
            <svg>
              <PhyloTreeLayer data={data} width={width} height={height} />
            </svg>
          } />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders SVG element', () => {
    renderLayer();
    expect(screen.getByTestId('phylo-tree-layer')).toBeInTheDocument();
  });

  it('renders with correct dimensions', () => {
    renderLayer(mockData, 800, 800);

    const svg = screen.getByTestId('phylo-tree-layer');
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '800');
  });

  it('handles empty data', () => {
    const emptyData = { name: '', children: [] };
    renderLayer(emptyData);

    expect(screen.getByTestId('phylo-tree-layer')).toBeInTheDocument();
  });
});