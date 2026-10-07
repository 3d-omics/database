import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MacrosampleComposition from './index'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    { fields: { ID: 'G', Name: 'Experiment G' } },
    { fields: { ID: 'M', Name: 'M - Histomonas experiment (turkey)' } },
  ],
}))

// Mock components
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid='breadcrumbs'>
      {items.map((item: any) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </div>
  ),
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, validating, notFound }: any) => {
    if (validating) return <div data-testid='validating'>Validating...</div>
    if (notFound) return <div data-testid='not-found'>Not Found</div>
    return <div>{children}</div>
  },
}))

vi.mock('./components/TaxonomyChart', () => ({
  default: ({ experimentId, selectedTaxonomicLevel }: any) => (
    <div data-testid='taxonomy-chart'>
      Chart-{experimentId}-{selectedTaxonomicLevel}
    </div>
  ),
}))

vi.mock('components/TaxonomyChartLegend', () => ({
  default: ({ experimentId, selectedTaxonomicLevel, layout }: any) => (
    <div data-testid='taxonomy-legend' data-layout={layout}>
      Legend-{experimentId}-{selectedTaxonomicLevel}
    </div>
  ),
}))

vi.mock('components/TabComponents/MacrosampleTab', () => ({
  default: ({ id }: { id: string }) => <div data-testid='macrosample-tab'>Macrosamples for {id}</div>,
}))


describe('MacrosampleComposition', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  const renderPage = (experimentName = 'Experiment G') => {
    return render(
      <MemoryRouter
        initialEntries={[`/macrosample-compositions/${encodeURIComponent(experimentName)}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path='/macrosample-compositions/:experimentName' element={<MacrosampleComposition />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders page with experiment name in header', () => {
    renderPage('Experiment G')

    const header = screen.getByRole('banner')
    expect(header).toHaveTextContent('Experiment G')
  })

  it('renders breadcrumbs', () => {
    renderPage('Experiment G')

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
    expect(screen.getByText('Macrosamples')).toBeInTheDocument()
    expect(screen.getByText('Metagenomics')).toBeInTheDocument()
  })

  it('renders TaxonomyChart with experimentId', () => {
    renderPage('Experiment G')

    const chart = screen.getByTestId('taxonomy-chart')
    expect(chart).toBeInTheDocument()
    expect(chart).toHaveTextContent('Chart-G-phylum')
  })

  it('renders TaxonomyChartLegend with experimentId', () => {
    renderPage('Experiment G')

    const legend = screen.getByTestId('taxonomy-legend')
    expect(legend).toBeInTheDocument()
    expect(legend).toHaveTextContent('Legend-G-phylum')
  })

  it('passes phylum as default selectedTaxonomicLevel', () => {
    renderPage('Experiment G')

    expect(screen.getByText('Chart-G-phylum')).toBeInTheDocument()
    expect(screen.getByText('Legend-G-phylum')).toBeInTheDocument()
  })

  it('stacks the full-width chart, taxonomy legend, and trial macrosamples in that order', () => {
    renderPage()

    const section = screen.getByRole('region', { name: 'Community composition' })
    const chart = screen.getByTestId('taxonomy-chart')
    const legend = screen.getByTestId('taxonomy-legend')
    const macrosamples = screen.getByTestId('macrosample-tab')
    expect(section).toContainElement(chart)
    expect(section).toContainElement(legend)
    expect(section).toHaveClass('page_padding')
    expect(legend).toHaveAttribute('data-layout', 'row')
    expect(chart.compareDocumentPosition(legend) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(legend.compareDocumentPosition(macrosamples) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(macrosamples).toHaveTextContent('Macrosamples for G')
  })

  it('shows validating state', () => {
    (useValidateParams as any).mockReturnValue({
      validating: true,
      notFound: false,
    })

    renderPage('Experiment G')

    expect(screen.getByTestId('validating')).toBeInTheDocument()
  })

  it('shows not found state', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderPage('Experiment G')

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('uses the matched trial ID for another composition page and its macrosamples', () => {
    renderPage('M - Histomonas experiment (turkey)')

    expect(screen.getByText('Chart-M-phylum')).toBeInTheDocument()
    expect(screen.getByText('Legend-M-phylum')).toBeInTheDocument()
    expect(screen.getByText('Macrosamples for M')).toBeInTheDocument()
  })
})
