import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CrossReferenceTooltip from './index'

describe('CrossReferenceTooltip', () => {
  const mockData = [
    { ID: 'EXP001', Name: 'Experiment 1', Status: 'Active' },
    { ID: 'EXP002', Name: 'Experiment 2', Status: 'Completed' },
  ]

  const mockFields = [
    { key: 'Name', value: 'Name' },
    { key: 'Status', value: 'Status' },
  ]

  it('renders the value', () => {
    render(
      <CrossReferenceTooltip value='EXP001' data={mockData} fieldsName={mockFields} />
    )
    expect(screen.getByText('EXP001')).toBeInTheDocument()
  })

  it('shows icon when value exists', () => {
    render(
      <CrossReferenceTooltip value='EXP001' data={mockData} fieldsName={mockFields} />
    )
    expect(screen.getByTestId('cross-reference-icon')).toBeInTheDocument()
  })

  it('does not show icon when value is empty', () => {
    render(
      <CrossReferenceTooltip value='' data={mockData} fieldsName={mockFields} />
    )
    expect(screen.queryByTestId('cross-reference-icon')).not.toBeInTheDocument()
  })

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CrossReferenceTooltip value='EXP001' data={mockData} fieldsName={mockFields} />
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const containerDiv = container.firstChild as HTMLElement
    await user.hover(containerDiv)

    expect(screen.getByText('Experiment 1')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CrossReferenceTooltip value='EXP001' data={mockData} fieldsName={mockFields} />
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const containerDiv = container.firstChild as HTMLElement
    await user.hover(containerDiv)
    expect(screen.getByText('Experiment 1')).toBeInTheDocument()

    await user.unhover(containerDiv)
    expect(screen.queryByText('Experiment 1')).not.toBeInTheDocument()
  })

  it('displays correct field values for matching record', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CrossReferenceTooltip value='EXP002' data={mockData} fieldsName={mockFields} />
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const containerDiv = container.firstChild as HTMLElement
    await user.hover(containerDiv)

    expect(screen.getByText(/Name:/)).toBeInTheDocument()
    expect(screen.getByText('Experiment 2')).toBeInTheDocument()
    expect(screen.getByText(/Status:/)).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('shows "Record not found" when data is null', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CrossReferenceTooltip value='EXP001' data={null} fieldsName={mockFields} />
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const containerDiv = container.firstChild as HTMLElement
    await user.hover(containerDiv)

    expect(screen.getByText('Record not found')).toBeInTheDocument()
  })
})