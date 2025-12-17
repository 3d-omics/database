import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AnimalTrials from './AnimalTrials';

// Mock data
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'EXP001',
        Name: 'Experiment G',
        Type: 'Poultry',
        StartDate: '2024-01-01',
        EndDate: '2024-03-31',
        'Bioproject accession': 'PRJNA12345',
        'Bioproject link': 'https://example.com/bioproject',
      },
    },
    {
      id: '2',
      createdTime: '2024-01-02',
      fields: {
        ID: 'EXP002',
        Name: 'Experiment H',
        Type: 'Swine',
        StartDate: '2024-02-01',
        EndDate: '2024-04-30',
      },
    },
  ],
}));

// Mock TableView
vi.mock('components/TableView', () => ({
  default: ({ data, columns, pageTitle, tableDescription }: any) => (
    <div data-testid="table-view">
      <div data-testid="page-title">{pageTitle}</div>
      <div data-testid="table-description">{tableDescription}</div>
      <div data-testid="data-count">{data.length}</div>
      <div data-testid="column-count">{columns.length}</div>
    </div>
  ),
}));

describe('AnimalTrials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AnimalTrials />
      </BrowserRouter>
    );
  };

  it('renders TableView component', () => {
    renderComponent();
    expect(screen.getByTestId('table-view')).toBeInTheDocument();
  });

  it('passes correct page title', () => {
    renderComponent();
    expect(screen.getByTestId('page-title')).toHaveTextContent('Animal Trials');
  });

  it('passes table description', () => {
    renderComponent();
    expect(screen.getByTestId('table-description')).toHaveTextContent(/animal experiments/i);
  });

  it('displays all data', () => {
    renderComponent();
    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('creates correct number of columns', () => {
    renderComponent();
    // ID, Name, Type, Start Date, End Date, Bioproject Accession, MAG Catalogue = 7
    expect(screen.getByTestId('column-count')).toHaveTextContent('7');
  });
});