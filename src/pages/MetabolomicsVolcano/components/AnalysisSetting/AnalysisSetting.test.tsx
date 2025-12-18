import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import AnalysisSettings from './index'

describe('AnalysisSettings', () => {
  const mockSetCompareBetween = vi.fn()
  const mockSetGroup1 = vi.fn()
  const mockSetGroup2 = vi.fn()
  const mockSetExecuteCreatePlot = vi.fn()

  const mockOptions = {
    Treatment: {
      'Group A': 'Treatment Group A',
      'Group B': 'Treatment Group B',
      'Group C': 'Treatment Group C',
    },
    Time: {
      'Day 0': 'Day 0',
      'Day 7': 'Day 7',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    return render(
      <AnalysisSettings
        compareBetween='Treatment'
        setCompareBetween={mockSetCompareBetween}
        group1='Group A'
        setGroup1={mockSetGroup1}
        group2='Group B'
        setGroup2={mockSetGroup2}
        setExecuteCreatePlot={mockSetExecuteCreatePlot}
        options={mockOptions}
        {...props}
      />
    )
  }

  it('renders all form elements', () => {
    renderComponent()

    expect(screen.getByLabelText(/Compare between:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Group 1:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Group 2:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Analysis/i })).toBeInTheDocument()
  })

  it('displays correct options in Compare between dropdown', () => {
    renderComponent()

    const compareBetweenSelect = screen.getByLabelText(/Compare between:/i) as HTMLSelectElement
    expect(compareBetweenSelect).toHaveValue('Treatment')

    expect(screen.getByRole('option', { name: 'Treatment' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Time' })).toBeInTheDocument()
  })

  it('displays correct options in Group 1 dropdown', () => {
    renderComponent()

    const group1Select = screen.getByLabelText(/Group 1:/i) as HTMLSelectElement

    // Use getAllByRole within the select
    const options = within(group1Select).getAllByRole('option')

    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('Treatment Group A')
    expect(options[1]).toHaveTextContent('Treatment Group B')
  })

  it('calls setCompareBetween when Compare between changes', async () => {
    const user = userEvent.setup()
    renderComponent()

    const compareBetweenSelect = screen.getByLabelText(/Compare between:/i)
    await user.selectOptions(compareBetweenSelect, 'Time')

    expect(mockSetCompareBetween).toHaveBeenCalledWith('Time')
  })

  it('calls setGroup1 when Group 1 changes', async () => {
    const user = userEvent.setup()
    renderComponent()

    const group1Select = screen.getByLabelText(/Group 1:/i)
    await user.selectOptions(group1Select, 'Group B')

    expect(mockSetGroup1).toHaveBeenCalledWith('Group B')
  })

  it('calls setGroup2 when Group 2 changes', async () => {
    const user = userEvent.setup()
    renderComponent()

    const group2Select = screen.getByLabelText(/Group 2:/i)
    await user.selectOptions(group2Select, 'Group C')

    expect(mockSetGroup2).toHaveBeenCalledWith('Group C')
  })

  it('shows error when same group selected', async () => {
    const user = userEvent.setup()
    renderComponent({ group1: 'Group A', group2: 'Group A' })

    const runButton = screen.getByRole('button', { name: /Run Analysis/i })
    await user.click(runButton)

    expect(screen.getAllByText(/Cannot compare between same group/i)).toHaveLength(2)
    expect(mockSetExecuteCreatePlot).not.toHaveBeenCalled()
  })

  it('does not show error when different groups selected', async () => {
    const user = userEvent.setup()
    renderComponent({ group1: 'Group A', group2: 'Group B' })

    const runButton = screen.getByRole('button', { name: /Run Analysis/i })
    await user.click(runButton)

    expect(screen.queryByText(/Cannot compare between same group/i)).not.toBeInTheDocument()
    expect(mockSetExecuteCreatePlot).toHaveBeenCalledWith(true)
  })

  it('applies error styling to group selects when error occurs', async () => {
    const user = userEvent.setup()
    renderComponent({ group1: 'Group A', group2: 'Group A' })

    const runButton = screen.getByRole('button', { name: /Run Analysis/i })
    await user.click(runButton)

    const group1Select = screen.getByLabelText(/Group 1:/i)
    const group2Select = screen.getByLabelText(/Group 2:/i)

    expect(group1Select).toHaveClass('border-red-500')
    expect(group2Select).toHaveClass('border-red-500')
  })

  it('clears error when group selection changes', async () => {
    const user = userEvent.setup()

    const { rerender } = renderComponent({ group1: 'Group A', group2: 'Group A' })

    const runButton = screen.getByRole('button', { name: /Run Analysis/i })
    await user.click(runButton)

    expect(screen.getAllByText(/Cannot compare between same group/i)).toHaveLength(2)

    // Simulate group change by rerendering with different group2
    rerender(
      <AnalysisSettings
        compareBetween='Treatment'
        setCompareBetween={mockSetCompareBetween}
        group1='Group A'
        setGroup1={mockSetGroup1}
        group2='Group B'
        setGroup2={mockSetGroup2}
        setExecuteCreatePlot={mockSetExecuteCreatePlot}
        options={mockOptions}
      />
    )

    await waitFor(() => {
      expect(screen.queryByText(/Cannot compare between same group/i)).not.toBeInTheDocument()
    })
  })
})