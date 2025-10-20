import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MetaboliteColumn from './MetaboliteColumn'
import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'


const renderMetaboliteColumn = (checkedMetaboliteIds: string[]) => {
    const mockCell = {
      id: '1_Metabolite',
      getValue: () => 'Yes',
      row: { original: { fields: { ID: 'I001dH' } } }
    }
    const setCheckedIds = vi.fn()
    render(<MetaboliteColumn cell={mockCell} checkedMetaboliteIds={checkedMetaboliteIds} setCheckedMetaboliteIds={setCheckedIds} />)
    return { setCheckedIds }
  }




describe('MetaboliteColumn', () => {

  it('should render checkbox when cell value is "Yes" and ID exists', () => {
    renderMetaboliteColumn([])
    expect(screen.getByTestId('metabolite-checkbox')).toBeInTheDocument()
  })



  it('should show checkbox as checked when ID is in "checkedMetaboliteIds" array', () => {
    renderMetaboliteColumn(['I001dH'])
    expect(screen.getByTestId('metabolite-checkbox')).toBeChecked()
  })



  it('should show checkbox as unchecked when ID is not in array', () => {
    renderMetaboliteColumn(['Z9999zZ'])
    expect(screen.getByTestId('metabolite-checkbox')).not.toBeChecked()
  })



  it('should add metabolite ID to "checkedMetaboliteIds" array when checkbox is checked', () => {
    const { setCheckedIds } = renderMetaboliteColumn([])
    fireEvent.click(screen.getByTestId('metabolite-checkbox'))
    expect(setCheckedIds).toHaveBeenCalledWith(['I001dH'])
  })




  it('should remove metabolite ID from "checkedMetaboliteIds" array when checkbox is unchecked', () => {
    const { setCheckedIds } = renderMetaboliteColumn(['I001dH', 'I001dI'])
    fireEvent.click(screen.getByTestId('metabolite-checkbox'))
    expect(setCheckedIds).toHaveBeenCalledWith(['I001dI'])
  })



  it('should render "-" when cell value is "No"', () => {
    const mockCell = {
      id: 'cell-1',
      getValue: () => 'No',
      row: { original: { fields: { ID: 'B001aA' } } }
    }
    const checkedIds: string[] = []
    const setCheckedIds = vi.fn()
    render(<MetaboliteColumn cell={mockCell} checkedMetaboliteIds={checkedIds} setCheckedMetaboliteIds={setCheckedIds} />)
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.queryByTestId('metabolite-checkbox')).not.toBeInTheDocument()
  })

})
