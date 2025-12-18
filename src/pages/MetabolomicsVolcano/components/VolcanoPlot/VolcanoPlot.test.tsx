import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import VolcanoPlot from './index'

// Mock heavy dependencies
vi.mock('xlsx', () => ({
  default: {
    read: vi.fn(),
    utils: {
      sheet_to_json: vi.fn(),
    },
  },
}))

vi.mock('react-plotly.js', () => ({
  default: ({ data, layout }: any) => (
    <div data-testid='plotly-plot'>
      <div data-testid='plot-data'>{JSON.stringify(data)}</div>
      <div data-testid='plot-layout'>{JSON.stringify(layout)}</div>
    </div>
  ),
}))

// Mock Excel file imports
vi.mock('assets/data/metabolomics/metabolomics_G.xlsx', () => ({ default: 'mock-file-g' }))
vi.mock('assets/data/metabolomics/metabolomics_H.xlsx', () => ({ default: 'mock-file-h' }))
vi.mock('assets/data/metabolomics/metabolomics_I.xlsx', () => ({ default: 'mock-file-i' }))
vi.mock('assets/data/metabolomics/metabolomics_J.xlsx', () => ({ default: 'mock-file-j' }))
vi.mock('assets/data/metabolomics/metabolomics_K.xlsx', () => ({ default: 'mock-file-k' }))
vi.mock('assets/data/metabolomics/metabolomics_M.xlsx', () => ({ default: 'mock-file-m' }))

// Suppress console errors
const originalError = console.error
beforeAll(() => {
  console.error = vi.fn()
})
afterAll(() => {
  console.error = originalError
})

describe('VolcanoPlot', () => {
  const mockSetExecuteCreatePlot = vi.fn()
  const mockSetCalculatedData = vi.fn()
  const mockSetPValueThreshold = vi.fn()
  const mockSetFoldChangeThreshold = vi.fn()

  const mockOptions = {
    Treatment: {
      'Group A': 'Treatment Group A',
      'Group B': 'Treatment Group B',
    },
  }

  const mockCalculatedData = [
    { metabolite: 'M001', fold_change: 2.5, p_value: 3.2, significant: true },
    { metabolite: 'M002', fold_change: -1.8, p_value: 2.8, significant: true },
    { metabolite: 'M003', fold_change: 1.2, p_value: 1.5, significant: false },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderComponent = (props = {}) => {
    return render(
      <VolcanoPlot
        compareBetween='Treatment'
        group1='Group A'
        group2='Group B'
        executeCreatePlot={false}
        setExecuteCreatePlot={mockSetExecuteCreatePlot}
        calculatedData={null}
        setCalculatedData={mockSetCalculatedData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        setPValueThreshold={mockSetPValueThreshold}
        setFoldChangeThreshold={mockSetFoldChangeThreshold}
        experimentId='G'
        options={mockOptions}
        {...props}
      />
    )
  }

  it('shows empty state message when no data', () => {
    renderComponent({ calculatedData: null })

    expect(screen.getByText(/Select target groups and click "Run Analysis"/i)).toBeInTheDocument()
  })

  it('renders plot when calculatedData exists', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    expect(screen.getByTestId('plotly-plot')).toBeInTheDocument()
    expect(screen.queryByText(/Select target groups/i)).not.toBeInTheDocument()
  })

  it('displays group comparison header', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    expect(screen.getByText(/Treatment:/i)).toBeInTheDocument()
    expect(screen.getByText(/Treatment Group A/i)).toBeInTheDocument()
    expect(screen.getByText(/Treatment Group B/i)).toBeInTheDocument()
  })

  it('renders fold change threshold slider', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    const slider = screen.getByLabelText(/Fold Change Threshold:/i)
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveValue('1.5')
  })

  it('renders p-value threshold slider', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    const slider = screen.getByLabelText(/p-value Threshold:/i)
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveValue('0.05')
  })

  it('updates fold change threshold when slider changes', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    const slider = screen.getByLabelText(/Fold Change Threshold:/i)
    fireEvent.change(slider, { target: { value: '2.0' } })

    expect(mockSetFoldChangeThreshold).toHaveBeenCalledWith(2.0)
  })

  it('updates p-value threshold when slider changes', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    const slider = screen.getByLabelText(/p-value Threshold:/i)
    fireEvent.change(slider, { target: { value: '0.01' } })

    expect(mockSetPValueThreshold).toHaveBeenCalledWith(0.01)
  })

  it('displays fold change threshold value', () => {
    renderComponent({ calculatedData: mockCalculatedData, foldChangeThreshold: 2.3 })

    expect(screen.getByText('2.3')).toBeInTheDocument()
  })

  it('displays p-value threshold value', () => {
    renderComponent({ calculatedData: mockCalculatedData, pValueThreshold: 0.01 })

    expect(screen.getByText('0.010')).toBeInTheDocument()
  })

  it('renders legend on mobile', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    expect(screen.getByText('All Metabolites')).toBeInTheDocument()
    expect(screen.getByText('Significant UP')).toBeInTheDocument()
    expect(screen.getByText('Significant DOWN')).toBeInTheDocument()
  })

  it('creates three plot traces when data exists', () => {
    renderComponent({ calculatedData: mockCalculatedData })

    const plotData = screen.getByTestId('plot-data')
    const data = JSON.parse(plotData.textContent || '[]')

    // Should have 3 traces: All Metabolites, Significant UP, Significant DOWN
    expect(data).toHaveLength(3)
    expect(data[0].name).toBe('All Metabolites')
    expect(data[1].name).toBe('Significant UP')
    expect(data[2].name).toBe('Significant DOWN')
  })

  it('handles window resize', async () => {
    renderComponent({ calculatedData: mockCalculatedData })

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 1280 })
    Object.defineProperty(window, 'innerHeight', { value: 800 })

    window.dispatchEvent(new Event('resize'))

    await waitFor(() => {
      const layout = JSON.parse(screen.getByTestId('plot-layout').textContent || '{}')
      // Width calculation: 1280 - 580 = 700
      expect(layout.width).toBe(700)
    })
  })
})