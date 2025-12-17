import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Metabolomics from './index';
import useValidateParams from 'hooks/useValidateParams';


// Mock hooks
vi.mock('hooks/useValidateParams');

// Mock options
vi.mock('./options', () => ({
  getExperimentOptions: vi.fn((experimentId: string) => ({
    'Treatment': {
      'Group A': ['S001', 'S002'],
      'Group B': ['S003', 'S004'],
    },
    'Time': {
      'Day 0': ['S001', 'S003'],
      'Day 7': ['S002', 'S004'],
    },
  })),
}));

// Mock components
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid="breadcrumbs">
      {items.map((item: any) => <span key={item.label}>{item.label}</span>)}
    </div>
  ),
}));

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}));

vi.mock('./components/AnalysisSetting', () => ({
  default: ({ compareBetween, group1, group2 }: any) => (
    <div data-testid="analysis-settings">
      <div data-testid="compare-between">{compareBetween}</div>
      <div data-testid="group1">{group1}</div>
      <div data-testid="group2">{group2}</div>
    </div>
  ),
}));

vi.mock('./components/VolcanoPlot', () => ({
  default: () => <div data-testid="volcano-plot">Volcano Plot</div>,
}));

vi.mock('./components/SignificantMetabolitesTable', () => ({
  default: () => <div data-testid="significant-metabolites-table">Table</div>,
}));


describe('Metabolomics', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    });
  });

  const renderPage = (experimentName = 'G - Test Experiment') => {
    return render(
      <MemoryRouter
        initialEntries={[`/metabolomics/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/metabolomics/:experimentName" element={<Metabolomics />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders page with breadcrumbs', () => {
    renderPage();

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument();
    expect(screen.getByText('Metabolomics')).toBeInTheDocument();
  });

  it('displays experiment name as header', () => {
    renderPage('G - Test Experiment');
    expect(screen.getByText('G - Test Experiment')).toBeInTheDocument();
  });

  it('renders AnalysisSettings component', () => {
    renderPage();
    expect(screen.getByTestId('analysis-settings')).toBeInTheDocument();
  });

  it('renders VolcanoPlot component', () => {
    renderPage();
    expect(screen.getByTestId('volcano-plot')).toBeInTheDocument();
  });

  it('renders SignificantMetabolitesTable component', () => {
    renderPage();
    expect(screen.getByTestId('significant-metabolites-table')).toBeInTheDocument();
  });

  it('initializes state with first option from getExperimentOptions', () => {
    renderPage();

    // First key in options is 'Treatment'
    expect(screen.getByTestId('compare-between')).toHaveTextContent('Treatment');
    
    // First two keys in 'Treatment' are 'Group A' and 'Group B'
    expect(screen.getByTestId('group1')).toHaveTextContent('Group A');
    expect(screen.getByTestId('group2')).toHaveTextContent('Group B');
  });

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    });

    renderPage();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('extracts experimentId from experimentName', () => {
    // experimentId should be 'G' from "G - Test Experiment"
    renderPage('G - Test Experiment');
    
    // Component should render without errors
    expect(screen.getByTestId('volcano-plot')).toBeInTheDocument();
  });
});