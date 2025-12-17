import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AnimalSpecimenOverview from './AnimalSpecimenOverview';
import useValidateParams from 'hooks/useValidateParams';

// Mock hooks
vi.mock('hooks/useValidateParams');

// Mock data
vi.mock('assets/data/airtable/animalspecimen.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'AS001',
        Experiment_flat: 'Experiment G',
        Treatment_flat: 'Treatment 1',
        TreatmentName: 'Control',
        Pen: 'P1',
        SlaughteringDayCount: 35,
        SlaughteringDate: '2024-02-05',
        Weight: 2.5,
        'Biosample accession': 'SAMN12345',
        'Biosample link': 'https://example.com/biosample',
      },
    },
  ],
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

vi.mock('components/Tabs', () => ({
  default: ({ tabs, selectedTab, setSelectedTab }: any) => (
    <div data-testid="tabs">
      {tabs.map((tab: string) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          data-selected={selectedTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('components/TabComponents/MacrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid="macrosample-tab">Macrosample Tab: {id}</div>,
}));

vi.mock('components/TabComponents/CryosectionTab', () => ({
  default: ({ id }: any) => <div data-testid="cryosection-tab">Cryosection Tab: {id}</div>,
}));

vi.mock('components/TabComponents/MicrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid="microsample-tab">Microsample Tab: {id}</div>,
}));


describe('AnimalSpecimenOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    });
  });

  const renderPage = (specimenName = 'AS001') => {
    return render(
      <MemoryRouter
        initialEntries={[`/animal-specimens/${specimenName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/animal-specimens/:specimenName" element={<AnimalSpecimenOverview />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders breadcrumbs', () => {
    renderPage();

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument();
    expect(screen.getByText('Animal Specimen')).toBeInTheDocument();
  });

  it('displays specimen name as header', () => {
    renderPage();

    const headers = screen.getAllByText('AS001');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('displays specimen details', () => {
    renderPage();

    expect(screen.getByText(/Experiment G/i)).toBeInTheDocument();
    expect(screen.getByText(/Treatment 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Control/i)).toBeInTheDocument();
    expect(screen.getByText(/P1/i)).toBeInTheDocument();
  });

  it('displays biosample accession link', () => {
    renderPage();

    const link = screen.getByRole('link', { name: 'SAMN12345' });
    expect(link).toHaveAttribute('href', 'https://example.com/biosample');
  });

  it('renders tabs', () => {
    renderPage();

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByText('Macrosamples')).toBeInTheDocument();
    expect(screen.getByText('Cryosections')).toBeInTheDocument();
    expect(screen.getByText('Microsamples')).toBeInTheDocument();
  });

  it('shows Macrosample tab by default', () => {
    renderPage();

    expect(screen.getByTestId('macrosample-tab')).toBeInTheDocument();
    expect(screen.getByTestId('macrosample-tab')).toHaveTextContent('AS001');
  });

  it('switches to Cryosections tab when clicked', async () => {
    const user = userEvent.setup();
    renderPage();

    const cryosectionsButton = screen.getByText('Cryosections');
    await user.click(cryosectionsButton);

    expect(screen.getByTestId('cryosection-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('macrosample-tab')).not.toBeInTheDocument();
  });

  it('switches to Microsamples tab when clicked', async () => {
    const user = userEvent.setup();
    renderPage();

    const microsamplesButton = screen.getByText('Microsamples');
    await user.click(microsamplesButton);

    expect(screen.getByTestId('microsample-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('macrosample-tab')).not.toBeInTheDocument();
  });

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    });

    renderPage();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('handles case-insensitive specimen name', () => {
    renderPage('as001'); // lowercase
    expect(screen.getByText('AS001')).toBeInTheDocument();
  });
});