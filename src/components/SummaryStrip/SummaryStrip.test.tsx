import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SummaryStrip from './index'

vi.mock('assets/images/chicken.png', () => ({ default: 'chicken.png' }))
vi.mock('assets/images/pig.png', () => ({ default: 'pig.png' }))
vi.mock('assets/images/turkey.png', () => ({ default: 'turkey.png' }))

describe('SummaryStrip', () => {
  it.each([
    ['G', 'G - Salmonella experiment (chicken)', 'chicken', 'chicken.png'],
    ['C', 'C - Proof-of-principle swine trial', 'pig', 'pig.png'],
    ['M', 'M - Histomonas experiment (turkey)', 'turkey', 'turkey.png'],
  ])('shows the %s trial with its animal icon', (id, title, animal, image) => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SummaryStrip label='Sample summary' stats={[
        { label: 'Trial', value: id, to: '/animal-trials/example', title },
      ]} />
    </MemoryRouter>)

    const link = screen.getByRole('link', { name: `${id} ${animal}` })
    const icon = within(link).getByRole('img', { name: animal })
    expect(icon.getAttribute('style')).toContain(`mask-image: url(${image})`)
  })
})
