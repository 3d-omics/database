import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ParamsValidator from './index'

// Mock Loading component
vi.mock('components/Loading', () => ({
  default: () => <div data-testid='loading'>Loading...</div>,
}))

// Mock NotFound component
vi.mock('pages/NotFound', () => ({
  default: () => <div data-testid='not-found'>Not Found</div>,
}))

describe('ParamsValidator', () => {
  it('renders Loading when validating is true', () => {
    render(
      <ParamsValidator validating={true} notFound={false}>
        <div>Children</div>
      </ParamsValidator>
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByText('Children')).not.toBeInTheDocument()
  })

  it('renders NotFound when notFound is true', () => {
    render(
      <ParamsValidator validating={false} notFound={true}>
        <div>Children</div>
      </ParamsValidator>
    )

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
    expect(screen.queryByText('Children')).not.toBeInTheDocument()
  })

  it('renders children when both validating and notFound are false', () => {
    render(
      <ParamsValidator validating={false} notFound={false}>
        <div>Children Content</div>
      </ParamsValidator>
    )

    expect(screen.getByText('Children Content')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('not-found')).not.toBeInTheDocument()
  })

  it('prioritizes Loading over NotFound', () => {
    render(
      <ParamsValidator validating={true} notFound={true}>
        <div>Children</div>
      </ParamsValidator>
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('not-found')).not.toBeInTheDocument()
  })
})