import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaxonomyChart from './TaxonomyChart'
import { useGenomeJsonFile } from 'hooks/useJsonData'
import { useTaxonomyData } from 'hooks/useTaxonomyData'
import { useTaxonomyChart } from 'hooks/useTaxonomyChart'

// Mock hooks
vi.mock('hooks/useJsonData')
vi.mock('hooks/useTaxonomyData')
vi.mock('hooks/useTaxonomyChart')

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid='bar-chart'>Bar Chart</div>,
}))

// Mock utils
vi.mock('utils/chartUtils', () => ({
  dynamicXAxisPlugin: {},
  flattenedcolorScheme: vi.fn(() => ({ Firmicutes: '#FF0000' })),
}))

// Mock ErrorBanner
vi.mock('components/ErrorBanner', () => ({
  default: ({ children }: any) => <div data-testid='error-banner'>{children}</div>,
}))

// Suppress console warnings and act warnings
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = vi.fn()
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('act(')) return
    originalError(...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})



describe('TaxonomyChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers();

    // Default successful data loading
    (useGenomeJsonFile as any).mockReturnValue({
      genome: ['Genome1', 'Genome2'],
      phylum: ['p__Firmicutes', 'p__Proteobacteria'],
      class: ['c__Bacilli', 'c__Gammaproteobacteria'],
      order: ['o__Lactobacillales', 'o__Enterobacterales'],
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
      chartData: { labels: ['M001'], datasets: [] },
      options: {},
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  const renderChart = (props = {}) => {
    return render(
      <TaxonomyChart
        cryosection='G_CS1'
        microsampleIds={['M001', 'M002']}
        selectedTaxonomicLevel='phylum'
        experimentId='G'
        {...props}
      />
    )
  }

  it('shows loading skeleton initially', () => {
    (useTaxonomyData as any).mockReturnValue({
      taxonomyData: {},
      genomeCounts: null,
      isDataReady: false,
      fetchError: null,
    })

    renderChart()

    const skeletons = screen.getAllByRole('generic').filter(el =>
      el.className.includes('animate-pulse')
    )
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows error banner when data loading fails', () => {
    (useGenomeJsonFile as any).mockReturnValue(null)

    renderChart()

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText(/Failed to load taxonomy data/i)).toBeInTheDocument()
  })

  it('shows error banner when fetchError exists', () => {
    (useTaxonomyData as any).mockReturnValue({
      taxonomyData: {},
      genomeCounts: null,
      isDataReady: false,
      fetchError: 'Failed to fetch',
    })

    renderChart()

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
  })

  it('renders chart when data is ready', async () => {
    renderChart()

    // Advance timers for initialization (100ms)
    await vi.advanceTimersByTimeAsync(150)

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('leaves choosing the level to its parent', async () => {
    renderChart()

    await vi.advanceTimersByTimeAsync(150)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('covers the chart while it is redrawn at a new level', async () => {
    renderChart({ isChangingLevel: true })

    await vi.advanceTimersByTimeAsync(150)

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByText('Updating chart...')).toBeInTheDocument()
  })
})