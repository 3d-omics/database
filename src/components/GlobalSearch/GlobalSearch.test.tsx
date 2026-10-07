import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import GlobalSearch from './index'
import type { SearchEntry } from './searchIndex'
import { loadSearchIndex } from './searchIndex'

vi.mock('./searchIndex', async (importOriginal) => ({
  ...await importOriginal<typeof import('./searchIndex')>(),
  loadSearchIndex: vi.fn(),
}))

const entries: SearchEntry[] = [
  { category: 'Animal specimen', title: 'G123', subtitle: 'Trial G', url: '/animal-specimens/G123', keywords: '' },
  { category: 'Microsample', title: 'G123eI101A', subtitle: 'Cryosection G123eI101', url: '/microsamples/G123eI101A', keywords: '' },
]

const renderSearch = () => render(
  <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path='/' element={<GlobalSearch />} />
      <Route path='/animal-specimens/:id' element={<p>Specimen detail</p>} />
      <Route path='/search' element={<p>Search results page</p>} />
    </Routes>
  </MemoryRouter>
)

describe('GlobalSearch', () => {
  beforeEach(() => vi.mocked(loadSearchIndex).mockReset().mockResolvedValue(entries))

  it('loads the index when focused and links matching records to detail pages', async () => {
    renderSearch()
    expect(loadSearchIndex).not.toHaveBeenCalled()
    const input = screen.getByRole('searchbox', { name: 'Search the data portal' })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'G123' } })
    expect(await screen.findByRole('link', { name: /G123 Animal specimen/ })).toHaveAttribute('href', '/animal-specimens/G123')
    fireEvent.click(screen.getByRole('link', { name: /G123 Animal specimen/ }))
    expect(screen.getByText('Specimen detail')).toBeInTheDocument()
  })

  it('submits a query to the full results page', () => {
    renderSearch()
    const input = screen.getByRole('searchbox', { name: 'Search the data portal' })
    fireEvent.change(input, { target: { value: 'Bacillota' } })
    fireEvent.submit(screen.getByRole('search', { name: 'Search the data portal' }))
    expect(screen.getByText('Search results page')).toBeInTheDocument()
  })

  it('moves to the first suggestion with Arrow Down and closes with Escape', async () => {
    renderSearch()
    const input = screen.getByRole('searchbox', { name: 'Search the data portal' })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'G123' } })
    const first = await screen.findByRole('link', { name: /G123 Animal specimen/ })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(first).toHaveFocus()
    fireEvent.keyDown(first, { key: 'Escape' })
    expect(input).toHaveFocus()
    expect(screen.queryByRole('link', { name: /G123 Animal specimen/ })).not.toBeInTheDocument()
  })
})
