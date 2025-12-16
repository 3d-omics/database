import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaxonomyChartLegend from './index';
import { useGenomeJsonFile } from 'hooks/useJsonData';

// Mock useGenomeJsonFile
vi.mock('hooks/useJsonData', () => ({
  useGenomeJsonFile: vi.fn(),
}));

// Mock color scheme import
vi.mock('../../config/taxonomy-color-scheme.ts', () => ({
  colorScheme: {
    Firmicutes: {
      color: '#FF0000',
      class: {
        Bacilli: {
          color: '#FF5555',
          order: {
            Lactobacillales: { color: '#FFAAAA' },
          },
        },
      },
    },
    Proteobacteria: {
      color: '#00FF00',
      class: {
        Gammaproteobacteria: {
          color: '#55FF55',
          order: {
            Enterobacterales: { color: '#AAFFAA' },
          },
        },
      },
    },
  },
}));


describe('TaxonomyChartLegend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock metadata
    (useGenomeJsonFile as any).mockReturnValue({
      phylum: ['p__Firmicutes', 'p__Proteobacteria'],
      class: ['c__Bacilli', 'c__Gammaproteobacteria'],
      order: ['o__Lactobacillales', 'o__Enterobacterales'],
    });
  });

  it('renders legend with phylum names', () => {
    render(
      <TaxonomyChartLegend
        selectedTaxonomicLevel="phylum"
        experimentId="G"
      />
    );

    expect(screen.getByText('Firmicutes')).toBeInTheDocument();
    expect(screen.getByText('Proteobacteria')).toBeInTheDocument();
  });

  it('expands to class level when selectedTaxonomicLevel is class', () => {
    render(
      <TaxonomyChartLegend
        selectedTaxonomicLevel="class"
        experimentId="G"
      />
    );

    expect(screen.getByText('Bacilli')).toBeInTheDocument();
    expect(screen.getByText('Gammaproteobacteria')).toBeInTheDocument();
  });

  it('expands to order level when selectedTaxonomicLevel is order', () => {
    render(
      <TaxonomyChartLegend
        selectedTaxonomicLevel="order"
        experimentId="G"
      />
    );

    expect(screen.getByText('Lactobacillales')).toBeInTheDocument();
    expect(screen.getByText('Enterobacterales')).toBeInTheDocument();
  });

  it('handles null metadata gracefully', () => {
    (useGenomeJsonFile as any).mockReturnValue(null);

    render(
      <TaxonomyChartLegend
        selectedTaxonomicLevel="phylum"
        experimentId="G"
      />
    );

    // Component should render without errors even with null metadata
    expect(screen.queryByText('Firmicutes')).not.toBeInTheDocument();
    expect(screen.queryByText('Proteobacteria')).not.toBeInTheDocument();
  });

  it('filters color scheme to only show present taxa', () => {
    // Mock metadata with only Firmicutes
    (useGenomeJsonFile as any).mockReturnValue({
      phylum: ['p__Firmicutes'],
      class: ['c__Bacilli'],
      order: ['o__Lactobacillales'],
    });

    render(
      <TaxonomyChartLegend
        selectedTaxonomicLevel="order"
        experimentId="G"
      />
    );

    expect(screen.getByText('Firmicutes')).toBeInTheDocument();
    expect(screen.queryByText('Proteobacteria')).not.toBeInTheDocument();
  });
});