import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MacrosampleCompositionList from './MacrosampleCompositionList';

// Mock data
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        Name: 'Experiment G',
        'MAG catalogue - Number of MAGs': 500,
        'MAG catalogue - Average completeness (%)': 95.5,
        'MAG catalogue - Average contamination (%)': 2.3,
        'MAG catalogue - New species (%)': 15.7,
      },
    },
    {
      id: '2',
      fields: {
        Name: 'Experiment H',
        'MAG catalogue - Number of MAGs': 300,
        'MAG catalogue - Average completeness (%)': 92.1,
      },
    },
    {
      id: '3',
      fields: {
        Name: 'Experiment I',
      },
    },
  ],
}));

describe('MacrosampleCompositionList', () => {
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
        <MacrosampleCompositionList />
      </BrowserRouter>
    );
  };

  it('renders page header', () => {
    renderPage();
    expect(screen.getByText('Macrosample Community Composition')).toBeInTheDocument();
  });

  it('renders page description', () => {
    renderPage();
    expect(screen.getByText(/DNA sequencing reads produced/i)).toBeInTheDocument();
  });

  it('renders all experiments', () => {
    renderPage();

    expect(screen.getByText('Experiment G')).toBeInTheDocument();
    expect(screen.getByText('Experiment H')).toBeInTheDocument();
    expect(screen.getByText('Experiment I')).toBeInTheDocument();
  });

  it('renders links to composition pages', () => {
    renderPage();

    const linkG = screen.getByRole('link', { name: /Experiment G/i });
    expect(linkG).toHaveAttribute('href', '/macrosample-compositions/Experiment%20G');

    const linkH = screen.getByRole('link', { name: /Experiment H/i });
    expect(linkH).toHaveAttribute('href', '/macrosample-compositions/Experiment%20H');
  });

  it('displays MAG statistics when available', () => {
    renderPage();

    expect(screen.getByText('500')).toBeInTheDocument(); // Number of MAGs
    expect(screen.getByText('95.50%')).toBeInTheDocument(); // Average completeness
    expect(screen.getByText('2.30%')).toBeInTheDocument(); // Average contamination
    expect(screen.getByText('15.70%')).toBeInTheDocument(); // New species
  });

  it('handles missing statistics gracefully', () => {
    renderPage();

    // Experiment I has no stats, but should still render
    expect(screen.getByText('Experiment I')).toBeInTheDocument();
  });

  it('displays partial statistics', () => {
    renderPage();

    // Experiment H has only some stats
    expect(screen.getByText('300')).toBeInTheDocument(); // Number of MAGs
    expect(screen.getByText('92.10%')).toBeInTheDocument(); // Average completeness
    // Should not display contamination or new species for Experiment H
  });

  it('formats percentages to 2 decimal places', () => {
    renderPage();

    // Check that percentages are formatted correctly
    expect(screen.getByText('95.50%')).toBeInTheDocument();
    expect(screen.getByText('2.30%')).toBeInTheDocument();
    expect(screen.getByText('15.70%')).toBeInTheDocument();
  });
});