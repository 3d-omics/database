import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MicrosampleOverview from './MicrosampleOverview'

vi.mock('assets/data/airtable/microsample.json', () => ({ default: [
  { fields: { Code: 'G121eI104C001', Cryosection_flat: 'G121eI104C', Size: 4976, Xcoord: 10, Ycoord: 20, LMBatch_flat: 'LMB0026', 'ENA accession': ['ERR1'], 'ENA link': 'https://example.org/ERR1' } },
  { fields: { Code: 'G121eI104C002', Cryosection_flat: 'G121eI104C', Size: 5000 } },
] }))
vi.mock('assets/data/airtable/microsampleswithcoordination.json', () => ({ default: [
  { fields: { ID: 'M301570', run_accession: 'ERR1' } },
] }))
vi.mock('assets/data/airtable/cryosection.json', () => ({ default: [
  { fields: { ID: 'G121eI104C', Macrosample: 'G121eI' } },
] }))
vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({ default: [
  { fields: { ID: 'G121eI', Individual: 'G121' } },
] }))
vi.mock('assets/data/airtable/animalspecimen.json', () => ({ default: [
  { fields: { ID: 'G121', Experiment_flat: 'G' } },
] }))
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({ default: [
  { fields: { ID: 'G', Name: 'G - Salmonella experiment (chicken)' } },
] }))
vi.mock('components/EnaRunMetadata', () => ({ default: ({ accessions }: { accessions: string[] }) => <div>ENA runs: {accessions.join(', ')}</div> }))
vi.mock('components/SampleTaxonomyOverview', () => ({ default: ({ sampleId, kind }: { sampleId?: string, kind: string }) => <div>Taxonomy {kind}: {sampleId ?? 'none'}</div> }))

const renderPage = (code: string) => render(<MemoryRouter initialEntries={[`/microsamples/${code}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes><Route path='/microsamples/:microsampleCode' element={<MicrosampleOverview />} /></Routes>
</MemoryRouter>)

describe('MicrosampleOverview', () => {
  it('links its parents, ENA run and count profile', () => {
    renderPage('G121eI104C001')
    const summary = screen.getByRole('region', { name: 'Microsample summary' })
    const trialLink = within(summary).getByRole('link', { name: 'G' })
    expect(trialLink).toHaveAttribute('href', '/animal-trials/G%20-%20Salmonella%20experiment%20(chicken)')
    expect(trialLink).toHaveAttribute('title', 'G - Salmonella experiment (chicken)')
    expect(trialLink).toHaveClass('no-underline')
    expect(within(summary).getByRole('link', { name: 'G121eI104C' })).toHaveAttribute('href', '/cryosections/G121eI104C')
    expect(within(summary).getByRole('link', { name: 'G121eI' })).toHaveAttribute('href', '/macrosamples/G121eI')
    expect(screen.getByText('ENA runs: ERR1')).toBeInTheDocument()
    const details = screen.getByRole('heading', { name: 'Sample details' }).closest('section')
    expect(details?.nextElementSibling).toBe(screen.getByText('Taxonomy micro: M301570'))
  })

  it('keeps the detail page available without an ENA mapping', () => {
    renderPage('G121eI104C002')
    expect(screen.getByRole('heading', { name: 'Sample details' })).toBeInTheDocument()
    expect(screen.queryByText(/No ENA run is linked/)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'ENA sequencing data' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Taxonomy micro/)).not.toBeInTheDocument()
  })

  it('does not show an invented record for an unknown code', () => {
    renderPage('missing')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
