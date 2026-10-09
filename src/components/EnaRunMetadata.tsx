import { useEffect, useState } from 'react'

export interface EnaRun {
  run_accession: string
  study_accession?: string
  study_title?: string
  sample_accession?: string
  secondary_sample_accession?: string
  sample_description?: string
  host_body_site?: string
  collection_date?: string
  experiment_accession?: string
  library_strategy?: string
  library_source?: string
  library_layout?: string
  instrument_model?: string
  read_count?: number
  base_count?: number
  first_public?: string
  fastq_urls?: string[]
}

interface EnaSnapshot {
  retrieved_at: string
  runs: Record<string, EnaRun>
}

const MetadataField = ({ label, value, href, detail }: {
  label: string
  value?: string | number
  href?: string
  detail?: string
}) => {
  if (value == null || value === '') return null

  return <div>
    <dt className='text-sm text-ink_muted'>{label}</dt>
    <dd className='mt-1 break-words font-jakarta font-semibold text-ink'>
      {href
        ? <a href={href} target='_blank' rel='noopener noreferrer' className='link text-burgundy_ink'>{value}</a>
        : value}
    </dd>
    {detail && <dd className='mt-1 text-sm text-ink_muted'>{detail}</dd>}
  </div>
}

const EnaRunMetadata = ({ accessions }: { accessions: string[] }) => {
  const [snapshot, setSnapshot] = useState<EnaSnapshot | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${import.meta.env.BASE_URL}ena-run-metadata.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('ENA snapshot could not be loaded')
        return response.json() as Promise<EnaSnapshot>
      })
      .then((data) => setSnapshot(data))
      .catch((cause) => {
        if (cause?.name !== 'AbortError') setError(true)
      })
    return () => controller.abort()
  }, [])

  return <section aria-labelledby='ena-data-heading'>
    <div className='flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1'>
      <h2 id='ena-data-heading' className='main_header text-2xl text-ink'>ENA sequencing data</h2>
      {snapshot && <p className='text-xs text-ink_muted'>ENA metadata as of {snapshot.retrieved_at}</p>}
    </div>
    {!snapshot && !error && <p className='mt-5 text-sm text-ink_muted'>Loading ENA metadata…</p>}
    {error && <p className='mt-5 text-sm text-ink_muted'>ENA metadata could not be loaded. The run accession in the header opens the ENA record.</p>}
    {snapshot && <div className='mt-5 space-y-5'>
      {accessions.map((accession) => {
        const run = snapshot.runs[accession]
        if (!run) return <p key={accession} className='text-sm text-ink_muted'>No ENA metadata is available for {accession} in this catalogue snapshot.</p>

        const library = [run.library_strategy, run.library_source, run.library_layout].filter(Boolean).join(' · ')
        return <article key={accession} className='max-w-6xl rounded-xl border border-line bg-surface_subtle p-5 sm:p-6'>
          <h3 className='font-jakarta text-lg font-bold text-burgundy_ink'>Run {accession}</h3>
          <dl className='mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 2xl:grid-cols-3'>
            <MetadataField label='Study' value={run.study_accession} href={run.study_accession && `https://www.ebi.ac.uk/ena/browser/view/${encodeURIComponent(run.study_accession)}`} detail={run.study_title} />
            <MetadataField label='BioSamples accession' value={run.sample_accession} href={run.sample_accession && `https://www.ebi.ac.uk/biosamples/samples/${encodeURIComponent(run.sample_accession)}`} />
            <MetadataField label='INSDC sample accession' value={run.secondary_sample_accession} href={run.secondary_sample_accession && `https://www.ebi.ac.uk/ena/browser/view/${encodeURIComponent(run.secondary_sample_accession)}`} />
            <MetadataField label='Material' value={run.sample_description} />
            <MetadataField label='Body site' value={run.host_body_site} />
            <MetadataField label='Collected' value={run.collection_date} />
            <MetadataField label='Sequencing instrument' value={run.instrument_model} />
            <MetadataField label='Library' value={library} />
            <MetadataField label='Reads' value={run.read_count?.toLocaleString('en-US')} />
            <MetadataField label='Bases' value={run.base_count?.toLocaleString('en-US')} />
            <MetadataField label='Public since' value={run.first_public} />
          </dl>
          {run.fastq_urls && run.fastq_urls.length > 0 && <div className='mt-6 border-t border-line pt-4'>
            <h4 className='font-jakarta text-sm font-semibold text-ink'>Read files</h4>
            <ul className='mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm'>
              {run.fastq_urls.map((url) => <li key={url}>
                <a href={url} target='_blank' rel='noopener noreferrer' className='link break-all text-burgundy_ink'>
                  {url.split('/').pop()}
                </a>
              </li>)}
            </ul>
          </div>}
        </article>
      })}
    </div>}
  </section>
}

export default EnaRunMetadata
