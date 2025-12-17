import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cryosections from './Cryosections';

// Mock data
vi.mock('assets/data/airtable/cryosection.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'G_CS1',
        Slide: 'S1',
        Slide_flat: 'Slide 1',
        Position: 'A1',
        SlideDate: '2024-01-15',
        Macrosample: 'M001',
        'Microsample number': 100,
      },
    },
    {
      id: '2',
      createdTime: '2024-01-02',
      fields: {
        ID: 'G_CS2',
        Slide: 'S1',
        Slide_flat: 'Slide 1',
        Position: 'A2',
        SlideDate: '2024-01-16',
        Macrosample: 'M002',
        'Microsample number': 150,
      },
    },
  ],
}));

vi.mock('assets/data/airtable/cryosectionimage.json', () => ({
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

describe('Cryosections', () => {
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
        <Cryosections {...props} />
      </BrowserRouter>
    );
  };

  it('renders TableView component', () => {
    renderComponent();
    expect(screen.getByTestId('table-view')).toBeInTheDocument();
  });

  it('passes correct page title', () => {
    renderComponent();
    expect(screen.getByTestId('page-title')).toHaveTextContent('Cryosections');
  });

  it('passes table description', () => {
    renderComponent();
    expect(screen.getByTestId('table-description')).toHaveTextContent(/thin intestinal cross-cuts/i);
  });

  it('displays all data by default', () => {
    renderComponent();
    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('creates correct number of columns', () => {
    renderComponent();
    // ID, Slide, Position, Macrosample, Slide Date, Microsample number = 6
    expect(screen.getByTestId('column-count')).toHaveTextContent('6');
  });

  it('filters data with startsWith condition', () => {
    renderComponent({
      filterWith: [{ id: 'ID', value: 'G_CS', condition: 'startsWith' }],
    });

    expect(screen.getByTestId('data-count')).toHaveTextContent('2');
  });

  it('filters data with equals condition', () => {
    renderComponent({
      filterWith: [{ id: 'Position', value: 'A1', condition: 'equals' }],
    });

    expect(screen.getByTestId('data-count')).toHaveTextContent('1');
  });

  it('handles multiple filters', () => {
    renderComponent({
      filterWith: [
        { id: 'Slide_flat', value: 'Slide 1', condition: 'equals' },
        { id: 'Position', value: 'A1', condition: 'equals' },
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
      filterWith: [{ id: 'SlideDate', value: '2024-01-15', condition: 'equals' }],
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