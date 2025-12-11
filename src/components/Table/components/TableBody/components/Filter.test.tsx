import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Filter from './Filter'


describe('components > Table > Filter', () => {

  it('should render DebouncedInput when filterVariant is not select', () => {
    const mockColumn = {
      getFilterValue: vi.fn().mockReturnValue('test value'),
      setFilterValue: vi.fn(),
      columnDef: {}
    }
    render(<Filter column={mockColumn as any} />)
    const inputElement = screen.getByPlaceholderText('Search...')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('type', 'text')
  })




  it('should render select dropdown when filterVariant is select', () => {
    const mockColumn = {
      getFilterValue: vi.fn().mockReturnValue('test value'),
      setFilterValue: vi.fn(),
      columnDef: {
        meta: {
          filterVariant: 'select'
        }
      }
    }
    render(<Filter column={mockColumn as any} />)
    const dropdownElement = screen.getByRole('combobox')
    expect(dropdownElement).toBeInTheDocument()
  })




  it('should display "All" option as first option in select dropdown', () => {
    const mockColumn = {
      getFilterValue: vi.fn().mockReturnValue(''),
      setFilterValue: vi.fn(),
      columnDef: {
        meta: {
          filterVariant: 'select',
          uniqueValues: ['value1', 'value2']
        }
      }
    }
    render(<Filter column={mockColumn as any} />)
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('All')
    expect(options[0]).toHaveValue('')
  })
  
})
