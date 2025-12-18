import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CompareSamplesButton from './index'

// Mock child components
vi.mock('../MetabolitePlots/Heatmap', () => ({
  default: () => <div data-testid='heatmap-plot'>Heatmap</div>,
}))

vi.mock('../MetabolitePlots/Bar', () => ({
  default: () => <div data-testid='bar-plot'>Bar Plot</div>,
}))

describe('CompareSamplesButton', () => {
  const mockSetSamples = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = (samples: string[] = ['S001'], experimentName = 'G - Test Experiment') => {
    return render(
      <MemoryRouter
        initialEntries={[`/metabolomics/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path='/metabolomics/:experimentName' element={
            <CompareSamplesButton samples={samples} setSamples={mockSetSamples} />
          } />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders button bar', () => {
    renderComponent()
    expect(screen.getByTestId('compare-metabolite-samples-button')).toBeInTheDocument()
  })

  it('displays correct sample count with singular form', () => {
    renderComponent(['S001'])
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('sample')).toBeInTheDocument()
  })

  it('displays correct sample count with plural form', () => {
    renderComponent(['S001', 'S002', 'S003'])
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('samples')).toBeInTheDocument()
  })

  it('clears samples when X button clicked', async () => {
    const user = userEvent.setup()
    renderComponent(['S001', 'S002'])

    const clearButton = screen.getByRole('button', { name: '' }) // X button has no text
    await user.click(clearButton)

    expect(mockSetSamples).toHaveBeenCalledWith([])
  })

  it('enables bar plot button when 1 sample selected', () => {
    renderComponent(['S001'])

    const barButton = screen.getByRole('button', { name: /View single sample/i })
    expect(barButton).not.toBeDisabled()
  })

  it('disables bar plot button when multiple samples selected', () => {
    renderComponent(['S001', 'S002'])

    const barButton = screen.getByRole('button', { name: /View single sample/i })
    expect(barButton).toBeDisabled()
  })

  it('disables heatmap button when 1 sample selected', () => {
    renderComponent(['S001'])

    const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
    expect(heatmapButton).toBeDisabled()
  })

  it('enables heatmap button when multiple samples selected', () => {
    renderComponent(['S001', 'S002'])

    const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
    expect(heatmapButton).not.toBeDisabled()
  })

  it('shows bar plot modal when bar button clicked', async () => {
    const user = userEvent.setup()
    renderComponent(['S001'])

    const barButton = screen.getByRole('button', { name: /View single sample/i })
    await user.click(barButton)

    expect(screen.getByTestId('bar-plot')).toBeInTheDocument()
  })

  it('shows heatmap modal when heatmap button clicked', async () => {
    const user = userEvent.setup()
    renderComponent(['S001', 'S002'])

    const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
    await user.click(heatmapButton)

    expect(screen.getByTestId('heatmap-plot')).toBeInTheDocument()
  })

  it('closes modal when close button clicked', async () => {
    const user = userEvent.setup()
    renderComponent(['S001'])

    // Open bar plot
    const barButton = screen.getByRole('button', { name: /View single sample/i })
    await user.click(barButton)
    expect(screen.getByTestId('bar-plot')).toBeInTheDocument()

    // Close modal
    const closeButton = screen.getByRole('button', { name: '✕' })
    await user.click(closeButton)

    expect(screen.queryByTestId('bar-plot')).not.toBeInTheDocument()
  })

  it('does not show modal initially', () => {
    renderComponent(['S001'])

    expect(screen.queryByTestId('bar-plot')).not.toBeInTheDocument()
    expect(screen.queryByTestId('heatmap-plot')).not.toBeInTheDocument()
  })
})