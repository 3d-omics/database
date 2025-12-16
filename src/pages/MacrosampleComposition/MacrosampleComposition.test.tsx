import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MacrosampleComposition from './index';
import useValidateParams from 'hooks/useValidateParams';

// Mock hooks
vi.mock('hooks/useValidateParams');

// Mock components
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid="breadcrumbs">
      {items.map((item: any) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </div>
  ),
}));

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, validating, notFound }: any) => {
    if (validating) return <div data-testid="validating">Validating...</div>;
    if (notFound) return <div data-testid="not-found">Not Found</div>;
    return <div>{children}</div>;
  },
}));

vi.mock('./components/TaxonomyChart', () => ({
  default: ({ experimentId, selectedTaxonomicLevel }: any) => (
    <div data-testid="taxonomy-chart">
      Chart-{experimentId}-{selectedTaxonomicLevel}
    </div>
  ),
}));

vi.mock('components/TaxonomyChartLegend', () => ({
  default: ({ experimentId, selectedTaxonomicLevel }: any) => (
    <div data-testid="taxonomy-legend">
      Legend-{experimentId}-{selectedTaxonomicLevel}
    </div>
  ),
}));


describe('MacrosampleComposition', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    });
  });

  const renderPage = (experimentName = 'Experiment G') => {
    return render(
      <MemoryRouter
        initialEntries={[`/macrosample-compositions/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/macrosample-compositions/:experimentName" element={<MacrosampleComposition />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders page with experiment name in header', () => {
    renderPage('Experiment G');

    const header = screen.getByRole('banner');
    expect(header).toHaveTextContent('Experiment G');
  });

  it('renders breadcrumbs', () => {
    renderPage('Experiment G');

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument();
    expect(screen.getByText('Macrosamples Community Composition')).toBeInTheDocument();
  });

  it('renders TaxonomyChart with experimentId', () => {
    renderPage('Experiment G');

    const chart = screen.getByTestId('taxonomy-chart');
    expect(chart).toBeInTheDocument();
    // experimentId = 'E' (first char of "Experiment G")
    expect(chart).toHaveTextContent('Chart-E-phylum');
  });

  it('renders TaxonomyChartLegend with experimentId', () => {
    renderPage('Experiment G');

    const legend = screen.getByTestId('taxonomy-legend');
    expect(legend).toBeInTheDocument();
    // experimentId = 'E' (first char of "Experiment G")
    expect(legend).toHaveTextContent('Legend-E-phylum');
  });

  it('passes phylum as default selectedTaxonomicLevel', () => {
    renderPage('Experiment G');

    expect(screen.getByText('Chart-E-phylum')).toBeInTheDocument();
    expect(screen.getByText('Legend-E-phylum')).toBeInTheDocument();
  });

  it('shows validating state', () => {
    (useValidateParams as any).mockReturnValue({
      validating: true,
      notFound: false,
    });

    renderPage('Experiment G');

    expect(screen.getByTestId('validating')).toBeInTheDocument();
  });

  it('shows not found state', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    });

    renderPage('Experiment G');

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('extracts experimentId from experimentName', () => {
    renderPage('Hello World');

    // experimentId should be 'H' (first character of full string)
    expect(screen.getByText('Chart-H-phylum')).toBeInTheDocument();
    expect(screen.getByText('Legend-H-phylum')).toBeInTheDocument();
  });
});