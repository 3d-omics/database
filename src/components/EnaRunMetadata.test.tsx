import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EnaRunMetadata from './EnaRunMetadata'

const snapshot = {
  retrieved_at: '2026-10-06',
  runs: {
    ERR15738788: {
      run_accession: 'ERR15738788',
      study_accession: 'PRJEB86258',
      study_title: "3D'omics: Salmonella challenge chicken trial",
      sample_accession: 'SAMEA120395769',
      sample_description: 'Digesta',
      host_body_site: 'Caecum right',
      collection_date: '2023-07-10',
      library_strategy: 'WGS',
      library_source: 'METAGENOMIC',
      library_layout: 'PAIRED',
      instrument_model: 'Illumina NovaSeq X',
      read_count: 44983378,
      base_count: 6747506700,
      first_public: '2025-10-18',
      fastq_urls: ['https://ftp.sra.ebi.ac.uk/vol1/fastq/ERR15738788_1.fastq.gz'],
    },
  },
}

describe('EnaRunMetadata', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => snapshot }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it('shows the linked ENA study, sample, run statistics and read files', async () => {
    render(<EnaRunMetadata accessions={['ERR15738788']} />)

    expect(await screen.findByText('44,983,378')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'PRJEB86258' }))
      .toHaveAttribute('href', 'https://www.ebi.ac.uk/ena/browser/view/PRJEB86258')
    expect(screen.getByRole('link', { name: 'SAMEA120395769' }))
      .toHaveAttribute('href', 'https://www.ebi.ac.uk/ena/browser/view/SAMEA120395769')
    expect(screen.getByText('Illumina NovaSeq X')).toBeInTheDocument()
    expect(screen.getByText('WGS · METAGENOMIC · PAIRED')).toBeInTheDocument()
    expect(screen.getByText('6,747,506,700')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ERR15738788_1.fastq.gz' }))
      .toHaveAttribute('href', snapshot.runs.ERR15738788.fastq_urls[0])
    expect(fetch).toHaveBeenCalledWith('/database/ena-run-metadata.json', expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it('explains when a linked run is absent from the snapshot', async () => {
    render(<EnaRunMetadata accessions={['ERR00000000']} />)

    expect(await screen.findByText(/No ENA metadata is available for ERR00000000/)).toBeInTheDocument()
  })

  it('offers the ENA header link when the snapshot cannot load', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<EnaRunMetadata accessions={['ERR15738788']} />)

    expect(await screen.findByText(/ENA metadata could not be loaded/)).toBeInTheDocument()
  })
})
