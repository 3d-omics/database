import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ParamsValidator from '.'

vi.mock('components/Loading', () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}))

vi.mock('pages/NotFound', () => ({
  default: () => <div data-testid="not-found">404 Not Found</div>,
}))


describe('ParamsValidator', () => {
  it('shows loading when validating is true', () => {
    render(
      <ParamsValidator validating={true} notFound={false}>
        <div>Content</div>
      </ParamsValidator>
    )

    expect(screen.getByTestId('loading-dots-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows not found when notFound is true', () => {
    render(
      <ParamsValidator validating={false} notFound={true}>
        <div>Content</div>
      </ParamsValidator>
    )

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows children when both validating and notFound are false', () => {
    render(
      <ParamsValidator validating={false} notFound={false}>
        <div>Content</div>
      </ParamsValidator>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('not-found')).not.toBeInTheDocument()
  })

  it('prioritizes loading over notFound when both are true', () => {
    render(
      <ParamsValidator validating={true} notFound={true}>
        <div>Content</div>
      </ParamsValidator>
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('not-found')).not.toBeInTheDocument()
  })
})