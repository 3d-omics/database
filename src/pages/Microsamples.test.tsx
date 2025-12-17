import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Microsamples from './Microsamples';

// Mock data
vi.mock('assets/data/airtable/microsample.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        Code: 'MS001',
        LMBatch: 'B1',
        LMBatch_flat: 'Batch 1',
        Cryosection: 'CS1',
        Cryosection_flat: 'G_CS1',
        CollectionMethod: ['Laser Microdissection'],
        Researcher: 'Researcher 1',
        Date: '2024-01-15',
        Shape: 'Circle',
        Xcoord: 100,
        Ycoord: 200,
        Size: 50000,
        'ENA accession': 'ERS12345',
        'ENA link': 'https://example.com/ena',
      },
    },
    {
      id: '2',
      createdTime: '2024-01-02',
      fields: {
        Code: 'MS002',
        LMBatch: 'B1',
        LMBatch_flat: 'Batch 1',
        Cryosection: 'CS2',
        Cryosection_flat: 'G_CS2',
        CollectionMethod: ['Laser Microdissection'],
        Researcher: 'Researcher 2',
        Date: '2024-01-16',
        Shape: 'Square',
        Xcoord: 150,
        Ycoord: 250,
        Size: 60000,
      },
    },
  ],
}));

vi.mock('assets/data/airtable/cryosection.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        ID: 'G_CS1',
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

describe('Microsamples', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Microsamples {...props} />
      </BrowserRouter>
    );
  };

  it('renders TableView component', () => {
    renderComponent();
    expect(screen.getByTestId('table-view')).toBeInTheDocument();
  });

  it('passes correct page title', () => {
    renderComponent();
    expect(screen.getByTestId('page-title')).toHaveTextContent('Microsamples');
  });

  it('passes table description', () => {
    renderComponent();
    expect(screen.getByTestId('table-description')).toHaveTextContent(/microscopic tissue\/digesta samples/i);
  });

  it('displays all data by default', () => {
    renderComponent();
    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('creates correct number of columns', () => {
    renderComponent();
    // Code, Batch, Cryosection, Collection Method, Date, Xcoord, Ycoord, Size, ENA Accession = 9
    expect(screen.getByTestId('column-count')).toHaveTextContent('9');
  });

  it('filters data with startsWith condition', () => {
    renderComponent({
      filterWith: [{ id: 'Code', value: 'MS00', condition: 'startsWith' }],
    });

    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('filters data with equals condition', () => {
    renderComponent({
      filterWith: [{ id: 'LMBatch_flat', value: 'Batch 1', condition: 'equals' }],
    });

    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('handles multiple filters', () => {
    renderComponent({
      filterWith: [
        { id: 'LMBatch_flat', value: 'Batch 1', condition: 'equals' },
        { id: 'Code', value: 'MS001', condition: 'equals' },
      ],
    });

    expect(screen.getByTestId('data-count')).toHaveTextContent('1');
  });

  it('handles empty filter array', () => {
    renderComponent({ filterWith: [] });
    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('filters out null/undefined values', () => {
    renderComponent({
      filterWith: [{ id: 'ENA accession', value: 'ERS', condition: 'startsWith' }],
    });

    expect(screen.getByTestId('data-count')).toHaveTextContent('1');
  });

  it('passes display props to TableView', () => {
    renderComponent({
      displayTableHeader: true,
      displayTableFilters: true,
      displayTableBody: false,
    });

    expect(screen.getByTestId('table-view')).toBeInTheDocument();
  });
});