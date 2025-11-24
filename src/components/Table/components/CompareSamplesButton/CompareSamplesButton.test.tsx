import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import CompareSamplesButton from '.'

// Mock the plot components
vi.mock('components/MetabolitePlots/Heatmap', () => ({
  default: ({ ids }: { ids: string[] }) => (
    <div data-testid="heatmap-plot">Heatmap - {ids.join(', ')}</div>
  ),
}))

vi.mock('components/MetabolitePlots/Bar', () => ({
  default: ({ id }: { id: string[] }) => (
    <div data-testid="bar-plot">Bar Plot - {id.join(', ')}</div>
  ),
}))

// Mock FontAwesome icon
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => <span data-testid="fa-icon">{icon.iconName}</span>,
}))

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faXmark: { iconName: 'xmark' },
}))

describe('CompareSamplesButton', () => {
  const mockSetSamples = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Button Bar Display', () => {
    it('renders with single sample selected', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      expect(screen.getByTestId('compare-metabolite-samples-button')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('sample')).toBeInTheDocument()
      expect(screen.getByText('selected')).toBeInTheDocument()
    })

    it('renders with multiple samples selected', () => {
      const samples = ['SAMPLE001', 'SAMPLE002', 'SAMPLE003']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('samples')).toBeInTheDocument()
      expect(screen.getByText('selected')).toBeInTheDocument()
    })

    it('displays close button', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      expect(screen.getByTestId('fa-icon')).toHaveTextContent('xmark')
    })
  })



  describe('Close Button', () => {
    it('calls setSamples with empty array when close button is clicked', () => {
      const samples = ['SAMPLE001', 'SAMPLE002']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const closeButton = screen.getByRole('button', { name: /xmark/i })
      fireEvent.click(closeButton)

      expect(mockSetSamples).toHaveBeenCalledWith([])
      expect(mockSetSamples).toHaveBeenCalledTimes(1)
    })
  })


  
  describe('Single Sample Button', () => {
    it('is enabled when exactly 1 sample is selected', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      expect(singleSampleButton).not.toBeDisabled()
    })

    it('is disabled when more than 1 sample is selected', () => {
      const samples = ['SAMPLE001', 'SAMPLE002']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      expect(singleSampleButton).toBeDisabled()
    })

    it('opens modal with bar plot when clicked', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      fireEvent.click(singleSampleButton)

      expect(screen.getByTestId('bar-plot')).toBeInTheDocument()
      expect(screen.getByTestId('bar-plot')).toHaveTextContent('Bar Plot - SAMPLE001')
    })
  })



  describe('Heatmap Button', () => {
    it('is disabled when exactly 1 sample is selected', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
      expect(heatmapButton).toBeDisabled()
    })

    it('is enabled when 2 or more samples are selected', () => {
      const samples = ['SAMPLE001', 'SAMPLE002']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
      expect(heatmapButton).not.toBeDisabled()
    })

    it('opens modal with heatmap when clicked', () => {
      const samples = ['SAMPLE001', 'SAMPLE002', 'SAMPLE003']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
      fireEvent.click(heatmapButton)

      expect(screen.getByTestId('heatmap-plot')).toBeInTheDocument()
      expect(screen.getByTestId('heatmap-plot')).toHaveTextContent(
        'Heatmap - SAMPLE001, SAMPLE002, SAMPLE003'
      )
    })
  })

  describe('Modal Behavior', () => {
    it('does not show modal initially', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('shows modal with correct title for single sample', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      fireEvent.click(singleSampleButton)

      expect(screen.getByText(/Single feature of:/i)).toBeInTheDocument()
      expect(screen.getByText('SAMPLE001')).toBeInTheDocument()
    })

    it('shows modal with correct title for heatmap comparison', () => {
      const samples = ['SAMPLE001', 'SAMPLE002']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
      fireEvent.click(heatmapButton)

      expect(screen.getByText(/Heatmap comparison of:/i)).toBeInTheDocument()
      expect(screen.getByText('SAMPLE001')).toBeInTheDocument()
      expect(screen.getByText('SAMPLE002')).toBeInTheDocument()
    })

    it('closes modal when X button is clicked', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      // Open modal
      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      fireEvent.click(singleSampleButton)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Close modal
      const closeModalButton = screen.getByText('✕')
      fireEvent.click(closeModalButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('displays backdrop when modal is open', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      // Open modal
      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      fireEvent.click(singleSampleButton)

      // eslint-disable-next-line testing-library/no-node-access
      const backdrop = document.querySelector('.fixed.inset-0.bg-black.opacity-50')
      expect(backdrop).toBeInTheDocument()
    })

    it('renders bar plot in modal for single sample', () => {
      const samples = ['SAMPLE001']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      fireEvent.click(singleSampleButton)

      expect(screen.getByTestId('bar-plot')).toBeInTheDocument()
      expect(screen.queryByTestId('heatmap-plot')).not.toBeInTheDocument()
    })

    it('renders heatmap in modal for multiple samples', () => {
      const samples = ['SAMPLE001', 'SAMPLE002']
      render(<CompareSamplesButton samples={samples} setSamples={mockSetSamples} />)

      const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
      fireEvent.click(heatmapButton)

      expect(screen.getByTestId('heatmap-plot')).toBeInTheDocument()
      expect(screen.queryByTestId('bar-plot')).not.toBeInTheDocument()
    })
  })


  describe('Sample Count Badge', () => {
    it('displays correct count for various sample sizes', () => {
      const testCases = [
        { samples: ['S1'], expected: '1' },
        { samples: ['S1', 'S2'], expected: '2' },
        { samples: ['S1', 'S2', 'S3', 'S4', 'S5'], expected: '5' },
      ]

      testCases.forEach(({ samples, expected }) => {
        const { unmount } = render(
          <CompareSamplesButton samples={samples} setSamples={mockSetSamples} />
        )
        expect(screen.getByText(expected)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Integration - Modal Switching', () => {
    it('can switch between different plot types by closing and reopening', () => {
      const { rerender } = render(
        <CompareSamplesButton samples={['SAMPLE001']} setSamples={mockSetSamples} />
      )

      // Open bar plot
      const singleSampleButton = screen.getByRole('button', { name: /View single sample/i })
      fireEvent.click(singleSampleButton)
      expect(screen.getByTestId('bar-plot')).toBeInTheDocument()

      // Close modal
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Change to 2 samples
      rerender(<CompareSamplesButton samples={['SAMPLE001', 'SAMPLE002']} setSamples={mockSetSamples} />)

      // Open heatmap
      const heatmapButton = screen.getByRole('button', { name: /Compare samples in Heatmap/i })
      fireEvent.click(heatmapButton)
      expect(screen.getByTestId('heatmap-plot')).toBeInTheDocument()
    })
  })
})