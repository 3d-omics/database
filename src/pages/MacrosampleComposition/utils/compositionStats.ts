import type { TrialStat } from 'components/TrialBlock'

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

// Shannon diversity as a Hill number of order 1: the exponent of Shannon entropy,
// read as an effective number of MAGs
const shannonDiversity = (values: number[]) => {
  const total = sum(values)
  const entropy = -sum(values.filter((value) => value > 0).map((value) => {
    const p = value / total
    return p * Math.log(p)
  }))
  return Math.exp(entropy)
}

// A trial's macrosample composition figures, from its counts table (a genome column
// and one per sample) and its genome metadata: the MAGs detected in at least one
// sample, the phyla they belong to, the samples with any mapped reads, and those
// samples' average Shannon diversity. Abundances are relative to each sample's
// total, as in the composition chart. A trial without data has no values
export const getCompositionStats = (
  counts: Record<string, any[]> | null,
  metadata: Record<string, any[]> | null,
): TrialStat[] => {
  if (!counts || !metadata) {
    return [
      { label: 'Number of MAGs' },
      { label: 'Number of phyla' },
      { label: 'Number of samples' },
      { label: 'Average Shannon diversity' },
    ]
  }

  const genomes: string[] = counts.genome || []
  const samples = Object.keys(counts)
    .filter((key) => key !== 'genome')
    .map((id) => counts[id].map((value) => parseFloat(value) || 0))
    .filter((values) => sum(values) > 0)

  const detected = genomes.filter((_, i) => samples.some((values) => values[i] > 0))
  const phylumOf = new Map((metadata.genome || []).map((genome, i) => [genome, metadata.phylum?.[i]]))
  const phyla = new Set(detected.map((genome) => phylumOf.get(genome)).filter(Boolean))
  const diversity = samples.length ? sum(samples.map(shannonDiversity)) / samples.length : undefined

  return [
    { label: 'Number of MAGs', value: detected.length.toLocaleString('en-US') },
    { label: 'Number of phyla', value: phyla.size.toLocaleString('en-US') },
    { label: 'Number of samples', value: samples.length.toLocaleString('en-US') },
    {
      label: 'Average Shannon diversity',
      value: diversity?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    },
  ]
}
