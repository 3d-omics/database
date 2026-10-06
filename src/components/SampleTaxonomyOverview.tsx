import { useMemo, useState } from 'react'
import { useGenomeJsonFile } from 'hooks/useJsonData'
import useChartTheme from 'hooks/useChartTheme'
import { colorScheme } from 'config/taxonomy-color-scheme'
import { flattenedcolorScheme } from 'utils/chartUtils'
import { sampleAbundance, type TaxonomicLevel } from 'utils/sampleAbundance'

const palette = flattenedcolorScheme(colorScheme)
const levels: TaxonomicLevel[] = ['phylum', 'class', 'order']

const SampleTaxonomyOverview = ({ kind, experimentId, sampleId, cryosection }: {
  kind: 'macro' | 'micro'
  experimentId: string
  sampleId?: string
  cryosection?: string
}) => {
  const [level, setLevel] = useState<TaxonomicLevel>('phylum')
  const theme = useChartTheme()
  const metadata = useGenomeJsonFile('genome_metadata', `experiment_${experimentId}_metadata`)
  const counts = useGenomeJsonFile(
    kind === 'macro' ? 'macro_genome_counts' : 'microsample_counts',
    kind === 'macro' ? `experiment_${experimentId}_counts` : cryosection ?? '',
  )
  const taxa = useMemo(() => sampleAbundance(counts, metadata, sampleId ?? '', level), [counts, metadata, sampleId, level])
  const shown = taxa.slice(0, 10)
  const other = taxa.slice(10).reduce((sum, taxon) => sum + taxon.fraction, 0)
  const segments = other > 0 ? [...shown, { name: 'Other', fraction: other }] : shown

  if (taxa.length === 0) return null

  return <section aria-labelledby='sample-taxonomy-heading'>
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <h2 id='sample-taxonomy-heading' className='main_header text-2xl text-ink'>Taxonomic relative abundance</h2>
      <div role='group' aria-label='Taxonomic level' className='flex gap-1'>
        {levels.map((choice) => <button
          key={choice}
          type='button'
          aria-pressed={level === choice}
          onClick={() => setLevel(choice)}
          className={`rounded px-3 py-1 text-sm font-semibold ${level === choice ? 'bg-burgundy text-white' : 'bg-surface_muted text-ink hover:bg-surface_strong'}`}
        >{choice[0].toUpperCase() + choice.slice(1)}</button>)}
      </div>
    </div>
    <p className='mt-2 max-w-3xl text-sm text-ink_muted'>Share of genome counts assigned to each taxon in this sample. The ten largest taxa are shown separately.</p>
    <div role='img' aria-label={`${level} relative abundance`} className='mt-6 flex h-12 overflow-hidden rounded border border-line'>
      {segments.map(({ name, fraction }) => <div
        key={name}
        title={`${name}: ${(fraction * 100).toFixed(1)}%`}
        style={{ width: `${fraction * 100}%`, backgroundColor: name === 'Other' ? theme.axis : palette[name] ?? theme.axis }}
      />)}
    </div>
    <dl className='mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3'>
      {segments.map(({ name, fraction }) => <div key={name} className='flex items-center gap-2 text-sm'>
        <span aria-hidden='true' className='h-3 w-3 shrink-0 rounded-sm' style={{ backgroundColor: name === 'Other' ? theme.axis : palette[name] ?? theme.axis }} />
        <dt className='min-w-0 flex-1 truncate text-ink' title={name}>{name}</dt>
        <dd className='font-semibold text-ink'>{(fraction * 100).toFixed(1)}%</dd>
      </div>)}
    </dl>
  </section>
}

export default SampleTaxonomyOverview
