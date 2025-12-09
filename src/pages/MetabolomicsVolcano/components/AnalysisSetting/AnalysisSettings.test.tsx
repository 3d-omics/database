import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AnalysisSettings from '.'

describe('Metabolomics page > AnalysisSettings component', () => {

  const mockSetCompareBetween =  vi.fn()
  const mockSetGroup1 = vi.fn()
  const mockSetGroup2 = vi.fn()
  const mockSetExecuteCreatePlot = vi.fn()

  const renderComponent = (compareBetween: string, group1: string, group2: string) => {
    return render(
      <AnalysisSettings
        compareBetween={compareBetween}
        setCompareBetween={mockSetCompareBetween}
        group1={group1}
        setGroup1={mockSetGroup1}
        group2={group2}
        setGroup2={mockSetGroup2}
        setExecuteCreatePlot={mockSetExecuteCreatePlot}
      />
    )
  }

  it('successfully executes analysis with different groups', () => {
    renderComponent('Diet', '1', '3')
    fireEvent.click(screen.getByText('Run Analysis'))
    expect(mockSetExecuteCreatePlot).toHaveBeenCalledWith(true)
  })



  it('dropdown state updates correctly', () => {
      renderComponent('Diet', '1', '3')
      const compareBetweenDropdown = screen.getByRole('combobox', { name: 'Compare between:' })
      const group1Dropdown = screen.getByRole('combobox', { name: 'Group 1:' })
      const group2Dropdown = screen.getByRole('combobox', {name: 'Group 2:'})
      fireEvent.change(compareBetweenDropdown, { target: { value: 'Group' } })
      expect(mockSetCompareBetween).toHaveBeenCalledWith('Group')
      fireEvent.change(group1Dropdown, { target: { value: 'T1' } })
      expect(mockSetGroup1).toHaveBeenCalledWith('T1')
      fireEvent.change(group2Dropdown, { target: { value: 'T2' } })
      expect(mockSetGroup2).toHaveBeenCalledWith('T2')
  })



  it('renders error message for same groups', () => {
      renderComponent('Diet', '1', '1')
      expect(screen.queryByText('Cannot compare between same group')).not.toBeInTheDocument()
      fireEvent.click(screen.getByText('Run Analysis'))
      expect(screen.getAllByText('Cannot compare between same group')).toHaveLength(2)
  })



  it('does not execute analysis with same groups', () => {
      renderComponent('Diet', 'T1', 'T1')
      mockSetExecuteCreatePlot.mockClear()
      fireEvent.click(screen.getByText('Run Analysis'))
      expect(mockSetExecuteCreatePlot).not.toHaveBeenCalledWith(true)
  })

})