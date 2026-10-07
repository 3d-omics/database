import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchResults from './SearchResults'
import { loadSearchIndex } from 'components/GlobalSearch/searchIndex'

vi.mock('components/GlobalSearch/searchIndex', async (importOriginal) => ({
  ...await importOriginal<typeof import('components/GlobalSearch/searchIndex')>(),
  loadSearchIndex: vi.fn(),
}))

describe('SearchResults', () => {
  it('shows matches from the shared index with direct detail links', async () => {
    vi.mocked(loadSearchIndex).mockResolvedValue([
      { category: 'Microsample', title: 'G123eI101A', url: '/microsamples/G123eI101A', subtitle: 'Cryosection G123eI101', keywords: 'ERR123456' },
    ])
    render(
      <MemoryRouter initialEntries={['/search?q=ERR123456']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SearchResults />
      </MemoryRouter>
    )

    expect(await screen.findByRole('link', { name: /G123eI101A Microsample/ }))
      .toHaveAttribute('href', '/microsamples/G123eI101A')
    expect(screen.getByRole('status')).toHaveTextContent('1 result for “ERR123456”')
  })
})
