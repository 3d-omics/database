import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock data
vi.mock('assets/data/airtable/_metadata.json', () => ({
  default: {
    tables: [
      { name: 'AnimalTrialExperiment', recordCount: 5 },
      { name: 'AnimalSpecimen', recordCount: 100 },
      { name: 'IntestinalSectionSample', recordCount: 250 },
      { name: 'Cryosection', recordCount: 50 },
      { name: 'Microsample', recordCount: 1000 },
    ],
  },
}));

vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        Name: 'Experiment G - Chicken trial',
        ID: 'EXP001',
      },
    },
    {
      id: '2',
      fields: {
        Name: 'Experiment H - Swine trial',
        ID: 'EXP002',
      },
    },
  ],
}));

// Mock images
vi.mock('assets/images/pig.png', () => ({ default: 'pig.png' }));
vi.mock('assets/images/chicken.png', () => ({ default: 'chicken.png' }));
vi.mock('assets/images/turkey.png', () => ({ default: 'turkey.png' }));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Home />
      </BrowserRouter>
    );
  };

  it('renders hero section', () => {
    renderPage();

    expect(screen.getByText("3D'omics Data Portal")).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the 3D'omics Data Portal/i)).toBeInTheDocument();
  });

  it('renders animal trials menu', () => {
    renderPage();

    expect(screen.getByText(/Experiment G - Chicken trial/i)).toBeInTheDocument();
    expect(screen.getByText(/Experiment H - Swine trial/i)).toBeInTheDocument();
  });

  it('renders navigation items with record counts', () => {
    renderPage();

    expect(screen.getByText('Animal Trials')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Animal Trials count

    expect(screen.getByText('Animal Specimens')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // Animal Specimens count

    expect(screen.getByText('Macrosamples')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument(); // Macrosamples count
  });

  it('renders all main navigation sections', () => {
    renderPage();

    expect(screen.getByText('Animal Trials')).toBeInTheDocument();
    expect(screen.getByText('Animal Specimens')).toBeInTheDocument();
    expect(screen.getByText('Macrosamples')).toBeInTheDocument();
    expect(screen.getByText('Cryosections')).toBeInTheDocument();
    expect(screen.getByText('Microsamples')).toBeInTheDocument();
  });

  it('renders sub-navigation items', () => {
    renderPage();

    expect(screen.getByText('MAG Catalogues')).toBeInTheDocument();
    expect(screen.getByText('Metagenomics')).toBeInTheDocument();
    expect(screen.getByText('Metabolomics')).toBeInTheDocument();
  });

  it('renders download database schema button', () => {
    renderPage();

    const downloadLink = screen.getByRole('link', { name: /Download Database Schema/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '/database-schema');
  });

  it('renders links to animal trial pages', () => {
    renderPage();

    const chickenLink = screen.getByRole('link', { name: /Experiment G - Chicken trial/i });
    expect(chickenLink).toHaveAttribute('href', '/animal-trials/Experiment%20G%20-%20Chicken%20trial');

    const swineLink = screen.getByRole('link', { name: /Experiment H - Swine trial/i });
    expect(swineLink).toHaveAttribute('href', '/animal-trials/Experiment%20H%20-%20Swine%20trial');
  });
});