import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Methods from './index'

vi.mock('./methodsContent', () => ({
  methods: [
    {
      slug: 'written',
      title: 'Written Method',
      intro: ['Intro paragraph.'],
      laboratory: ['Lab paragraph one.', 'Lab paragraph two.', 'A cited claim (Author, 2020).'],
      bioinformatics: [],
      subsections: {
        laboratory: [
          {
            heading: 'Instrument analysis',
            paragraphs: ['Instrument paragraph.'],
          },
        ],
        bioinformatics: [
          {
            heading: 'Processing step',
            paragraphs: ['Bioinformatic paragraph.'],
          },
        ],
      },
      references: [
        {
          cite: 'Author, 2020',
          text: 'Author, A. (2020). A cited paper. Journal, 1, 1–2.',
          url: 'https://doi.org/10.1000/xyz',
        },
      ],
    },
    {
      slug: 'empty',
      title: 'Empty Method',
      intro: ['Another intro.'],
      laboratory: [],
      bioinformatics: [],
      references: [],
    },
  ],
}))

describe('Methods', () => {
  const renderAt = (path: string) => {
    return render(
      <MemoryRouter
        initialEntries={[path]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path='/methods/:methodName' element={<Methods />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders the method title and introduction', () => {
    renderAt('/methods/written')
    expect(screen.getByRole('heading', { level: 1, name: 'Written Method' })).toBeInTheDocument()
    expect(screen.getByText('Intro paragraph.')).toBeInTheDocument()
  })

  it('renders breadcrumbs under Methods', () => {
    renderAt('/methods/written')
    const breadcrumbs = within(screen.getByTestId('breadcrumbs'))
    expect(breadcrumbs.getByText('Methods')).toBeInTheDocument()
    expect(breadcrumbs.getByText('Written Method')).toBeInTheDocument()
  })

  it('renders the laboratory and bioinformatic sections with their paragraphs', () => {
    renderAt('/methods/written')
    expect(screen.getByRole('heading', { name: 'Laboratory processing' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bioinformatic processing' })).toBeInTheDocument()
    expect(screen.getByText('Lab paragraph one.')).toBeInTheDocument()
    expect(screen.getByText('Lab paragraph two.')).toBeInTheDocument()
    expect(screen.getByText('Bioinformatic paragraph.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Instrument analysis' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Processing step' })).toBeInTheDocument()
    expect(screen.getByText('Instrument paragraph.')).toBeInTheDocument()
    expect(screen.queryByText(/in preparation/i)).not.toBeInTheDocument()
  })

  it('marks empty sections as in preparation', () => {
    renderAt('/methods/empty')
    expect(screen.getAllByText(/in preparation/i)).toHaveLength(2)
  })

  it('lists references with a link to each', () => {
    renderAt('/methods/written')
    expect(screen.getByRole('heading', { name: 'References' })).toBeInTheDocument()
    expect(screen.getByText(/A cited paper\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'https://doi.org/10.1000/xyz' }))
      .toHaveAttribute('href', 'https://doi.org/10.1000/xyz')
  })

  it('omits the references section when there are none', () => {
    renderAt('/methods/empty')
    expect(screen.queryByRole('heading', { name: 'References' })).not.toBeInTheDocument()
  })

  describe('in-text citations', () => {
    afterEach(() => {
      vi.useRealTimers()
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
    })

    it('link to their entry in the reference list', () => {
      renderAt('/methods/written')
      expect(screen.getByRole('link', { name: 'Author, 2020' })).toHaveAttribute('href', '#ref-1')
      expect(screen.getByText(/A cited paper\./).closest('li')).toHaveAttribute('id', 'ref-1')
    })

    it('scroll to, focus and briefly highlight the reference when clicked', () => {
      vi.useFakeTimers()
      // jsdom does not implement scrolling
      const scrollIntoView = vi.fn()
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: scrollIntoView, configurable: true })
      renderAt('/methods/written')
      const reference = screen.getByText(/A cited paper\./).closest('li')

      fireEvent.click(screen.getByRole('link', { name: 'Author, 2020' }))
      expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'center' }))
      expect(scrollIntoView.mock.contexts[0]).toBe(reference)
      expect(reference).toHaveFocus()
      expect(reference).toHaveClass('bg-light_mustard/70')

      act(() => { vi.advanceTimersByTime(2500) })
      expect(reference).not.toHaveClass('bg-light_mustard/70')
    })
  })

  it('renders NotFound for an unknown method', () => {
    renderAt('/methods/unknown')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
