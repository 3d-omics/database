export type TaxonomicLevel = 'phylum' | 'class' | 'order'

export interface TaxonAbundance {
  name: string
  fraction: number
}

// The count columns and metadata rows are keyed by genome, but need not be in
// the same order. Group the raw counts before normalising the sample to 100%.
export function sampleAbundance(
  counts: Record<string, (string | number)[]> | null,
  metadata: Record<string, string[]> | null,
  sampleId: string,
  level: TaxonomicLevel,
): TaxonAbundance[] {
  if (!counts || !metadata || !sampleId || !counts[sampleId]) return []

  const taxaByGenome = new Map((metadata.genome ?? []).map((genome, i) => [
    genome,
    (metadata[level]?.[i] ?? '').replace(/^[a-z]__/, '') || 'Unclassified',
  ]))
  const totals = new Map<string, number>()
  let total = 0
  ;(counts.genome ?? []).forEach((genome, i) => {
    const value = Number(counts[sampleId][i])
    if (!Number.isFinite(value) || value <= 0) return
    const taxon = taxaByGenome.get(String(genome)) ?? 'Unclassified'
    totals.set(taxon, (totals.get(taxon) ?? 0) + value)
    total += value
  })

  if (total === 0) return []
  return [...totals].map(([name, count]) => ({ name, fraction: count / total }))
    .sort((a, b) => b.fraction - a.fraction || a.name.localeCompare(b.name))
}
