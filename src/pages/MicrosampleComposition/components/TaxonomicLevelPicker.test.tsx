import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaxonomicLevelPicker from './TaxonomicLevelPicker'

describe('TaxonomicLevelPicker', () => {
  const originalWidth = window.innerWidth

  const setWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
  }

  afterEach(() => setWidth(originalWidth))

  it('offers the three levels as buttons, marking the one selected', () => {
    setWidth(1280)
    render(<TaxonomicLevelPicker selectedTaxonomicLevel='class' onChange={vi.fn()} />)

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Phylum', 'Class', 'Order'])
    expect(screen.getByRole('button', { name: 'Class' })).toHaveClass('bg-light_burgundy')
    expect(screen.getByRole('button', { name: 'Phylum' })).not.toHaveClass('bg-light_burgundy')
  })

  it('reports the level clicked', () => {
    setWidth(1280)
    const onChange = vi.fn()
    render(<TaxonomicLevelPicker selectedTaxonomicLevel='phylum' onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Order' }))
    expect(onChange).toHaveBeenCalledWith('order')
  })

  it('renders select dropdown on narrow screens', () => {
    setWidth(400)
    const onChange = vi.fn()
    render(<TaxonomicLevelPicker selectedTaxonomicLevel='phylum' onChange={onChange} />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'class' } })
    expect(onChange).toHaveBeenCalledWith('class')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('switches to the dropdown when the window narrows', () => {
    setWidth(1280)
    render(<TaxonomicLevelPicker selectedTaxonomicLevel='phylum' onChange={vi.fn()} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()

    setWidth(400)
    fireEvent(window, new Event('resize'))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('disables the levels while the chart is redrawn', () => {
    setWidth(1280)
    render(<TaxonomicLevelPicker selectedTaxonomicLevel='phylum' onChange={vi.fn()} disabled />)

    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
  })
})
