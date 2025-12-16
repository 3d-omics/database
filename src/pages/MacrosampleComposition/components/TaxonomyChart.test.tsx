import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import TaxonomyChart from './TaxonomyChart';
import { useGenomeJsonFile } from 'hooks/useJsonData';
import { useTaxonomyData } from 'hooks/useTaxonomyData';
import { useTaxonomyChart } from 'hooks/useTaxonomyChart';

// Suppress act warnings for timer-based state updates
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('act(')) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});


// Mock hooks
vi.mock('hooks/useJsonData');
vi.mock('hooks/useTaxonomyData');
vi.mock('hooks/useTaxonomyChart');

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
}));

// Mock utils
vi.mock('utils/chartUtils', () => ({
  dynamicXAxisPlugin: {},
  flattenedcolorScheme: vi.fn(() => ({ Firmicutes: '#FF0000' })),
}));

// Mock ErrorBanner
vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid="error-banner">{children}</div>,
}));


describe('TaxonomyChart', () => {
  const mockSetSelectedTaxonomicLevel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Default successful data loading
    (useGenomeJsonFile as any).mockReturnValue({
      genome: ['Genome1', 'Genome2'],
      Sample1: [100, 200],
      Sample2: [150, 250],
    });

    (useTaxonomyData as any).mockReturnValue({
      taxonomyData: {
        phylum: ['p__Firmicutes'],
        class: ['c__Bacilli'],
        order: ['o__Lactobacillales'],
        genome: ['Genome1', 'Genome2'],
      },
      genomeCounts: [[0.6, 0.4]],
      isDataReady: true,
      fetchError: null,
    });

    (useTaxonomyChart as any).mockReturnValue({
      chartData: { labels: ['Sample1'], datasets: [] },
      options: {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderChart = (props = {}) => {
    return render(
      <TaxonomyChart
        selectedTaxonomicLevel="phylum"
        setSelectedTaxonomicLevel={mockSetSelectedTaxonomicLevel}
        experimentId="G"
        {...props}
      />
    );
  };

  it('shows loading skeleton initially', () => {
    (useTaxonomyData as any).mockReturnValue({
      taxonomyData: {},
      genomeCounts: null,
      isDataReady: false,
      fetchError: null,
    });

    renderChart();

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('shows error banner when data loading fails', () => {
    (useGenomeJsonFile as any).mockReturnValue(null);

    renderChart();

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText(/Failed to load taxonomy data/i)).toBeInTheDocument();
  });

  it('shows error banner when fetchError exists', () => {
    (useTaxonomyData as any).mockReturnValue({
      taxonomyData: {},
      genomeCounts: null,
      isDataReady: false,
      fetchError: 'Failed to fetch',
    });

    renderChart();

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('renders chart when data is ready', async () => {
    renderChart();

    await vi.runAllTimersAsync();

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders taxonomic level buttons', async () => {
    renderChart();

    await vi.runAllTimersAsync();

    expect(screen.getByText('phylum')).toBeInTheDocument();
    expect(screen.getByText('class')).toBeInTheDocument();
    expect(screen.getByText('order')).toBeInTheDocument();
  });

  it('highlights selected taxonomic level', async () => {
    renderChart({ selectedTaxonomicLevel: 'class' });

    await vi.runAllTimersAsync();

    const classButton = screen.getByText('class');
    expect(classButton).toHaveClass('bg-light_burgundy');
  });

  it('calls setSelectedTaxonomicLevel when button clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderChart();

    await vi.runAllTimersAsync();

    const classButton = screen.getByText('class');

    const clickPromise = user.click(classButton);
    await vi.runAllTimersAsync();
    await clickPromise;

    expect(mockSetSelectedTaxonomicLevel).toHaveBeenCalledWith('class');
  });

  it('shows loading overlay when changing levels', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderChart();

    await vi.runAllTimersAsync();

    const orderButton = screen.getByText('order');

    const clickPromise = user.click(orderButton);

    // Advance just enough to show loading
    await vi.advanceTimersByTimeAsync(10);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await vi.runAllTimersAsync();
    await clickPromise;
  });

  it('disables buttons while changing levels', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderChart();

    await vi.runAllTimersAsync();

    const orderButton = screen.getByText('order');

    const clickPromise = user.click(orderButton);

    // Advance to trigger loading state
    await vi.advanceTimersByTimeAsync(10);

    expect(screen.getByRole('button', { name: 'phylum' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'class' })).toBeDisabled();

    await vi.runAllTimersAsync();
    await clickPromise;
  });
});