import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import DebouncedInput from './DebouncedInput'
import { fireEvent, waitFor } from '@testing-library/react'

describe('components > Table > DebouncedInput', () => {

  it('should trigger onChange callback after debounce delay', async () => {
    const mockOnChange = vi.fn()
    render(<DebouncedInput value="" onChange={mockOnChange} debounce={300} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(mockOnChange).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test')
    }, { timeout: 500 })
  })

})
