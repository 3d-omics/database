import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

// Mock data
vi.mock('assets/data/airtable/_metadata.json', () => ({
  default: {
    tables: [
      { name: 'AnimalTrialExperiment', recordCount: 5 },
      { name: 'AnimalSpecimen', recordCount: 100 },
      { name: 'IntestinalSectionSample', recordCount: 250 },
      { name: 'Cryosection', recordCount: 50 },
      { name: 'Microsample', recordCount: 1000 },
    ],
  },
}))

vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        Name: 'Experiment G - Chicken trial',
        ID: 'EXP001',
      },
    },
    {
      id: '2',
      fields: {
        Name: 'Experiment H - Swine trial',
        ID: 'EXP002',
      },
    },
  ],
}))

// Mock images
vi.mock('assets/images/pig.png', () => ({ default: 'pig.png' }))
vi.mock('assets/images/chicken.png', () => ({ default: 'chicken.png' }))
vi.mock('assets/images/turkey.png', () => ({ default: 'turkey.png' }))

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Home />
      </BrowserRouter>
    )
  }

  it('renders hero section', () => {
    renderPage()

    expect(screen.getByText("3D'omics Data Portal")).toBeInTheDocument()
    expect(screen.getByText(/Welcome to the 3D'omics Data Portal/i)).toBeInTheDocument()
  })

  it('renders animal trials menu', () => {
    renderPage()

    expect(screen.getByText(/Experiment G - Chicken trial/i)).toBeInTheDocument()
    expect(screen.getByText(/Experiment H - Swine trial/i)).toBeInTheDocument()
  })

  it('renders navigation items with record counts', () => {
    renderPage()

    expect(screen.getByText('Animal Trials')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // Animal Trials count

    expect(screen.getByText('Animal Specimens')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument() // Animal Specimens count

    expect(screen.getByText('Macrosamples')).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument() // Macrosamples count
  })

  it('shows record counts as tags with grouped thousands', () => {
    renderPage()

    expect(screen.getByText('1,000').parentElement).toHaveTextContent(/^1,000\s*records$/)
    expect(screen.getByText('5').parentElement).toHaveClass('text-burgundy_ink')
  })

  it('reveals the blocks one after another down the hierarchy', () => {
    renderPage()

    const revealDelay = (title: string) => {
      let element: HTMLElement | null = screen.getByRole('heading', { name: new RegExp(`^${title}`) })
      while (element && !element.classList.contains('animate-rise-in')) element = element.parentElement
      expect(element).toHaveClass('motion-reduce:animate-none')
      return parseInt(element!.style.animationDelay, 10)
    }

    const delays = ['Animal Trials', 'MAG Catalogues', 'Animal Specimens', 'Macrosamples',
      'Metagenomics', 'Metabolomics', 'Cryosections', 'Microsamples'].map(revealDelay)

    expect(delays[0]).toBe(0)
    delays.slice(1).forEach((delay, i) => expect(delay).toBeGreaterThan(delays[i]))
  })

  it('renders all main navigation sections', () => {
    renderPage()

    expect(screen.getByText('Animal Trials')).toBeInTheDocument()
    expect(screen.getByText('Animal Specimens')).toBeInTheDocument()
    expect(screen.getByText('Macrosamples')).toBeInTheDocument()
    expect(screen.getByText('Cryosections')).toBeInTheDocument()
    expect(screen.getByText('Microsamples')).toBeInTheDocument()
  })

  it('renders sub-navigation items', () => {
    renderPage()

    expect(screen.getByText('MAG Catalogues')).toBeInTheDocument()
    expect(screen.getByText('Metagenomics')).toBeInTheDocument()
    expect(screen.getByText('Metabolomics')).toBeInTheDocument()
  })

  it('introduces 3dtk with its install command and links', () => {
    renderPage()

    const toolkit = screen.getByRole('region', { name: /3dtk/i })
    expect(within(toolkit).getByText('pip install 3dtk')).toBeInTheDocument()
    expect(within(toolkit).getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/3d-omics/3dtk')
    expect(within(toolkit).getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', 'https://3dtk.readthedocs.io/')
    expect(screen.queryByRole('link', { name: /Download Database Schema/i })).not.toBeInTheDocument()
  })

  it('slides the experiment carousel in both directions', () => {
    renderPage()

    const track = screen.getByRole('list', { name: /animal trial experiments/i })
    // jsdom does no layout, so drive the scroll maths with known dimensions
    Object.defineProperty(track, 'clientWidth', { value: 400, configurable: true })
    Object.defineProperty(track, 'scrollWidth', { value: 1200, configurable: true })
    const scrollTo = vi.fn()
    track.scrollTo = scrollTo

    fireEvent.click(screen.getByRole('button', { name: /next experiments/i }))
    expect(scrollTo).toHaveBeenCalledWith({ left: 400, behavior: 'smooth' })

    // at the start, sliding back wraps around to the far end
    fireEvent.click(screen.getByRole('button', { name: /previous experiments/i }))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 800, behavior: 'smooth' })
  })

  it('renders links to animal trial pages', () => {
    renderPage()

    const chickenLink = screen.getByRole('link', { name: /Experiment G - Chicken trial/i })
    expect(chickenLink).toHaveAttribute('href', '/animal-trials/Experiment%20G%20-%20Chicken%20trial')

    const swineLink = screen.getByRole('link', { name: /Experiment H - Swine trial/i })
    expect(swineLink).toHaveAttribute('href', '/animal-trials/Experiment%20H%20-%20Swine%20trial')
  })
})