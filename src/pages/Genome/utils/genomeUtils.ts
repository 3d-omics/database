export type SampleData = Array<{
  id: string
  count: number
  [key: string]: string | number | null 
}>

export const processCounts = (
  counts: Record<string, any[]> | null,
  genomeName: string
): SampleData => {
  if (!counts || !counts.genome || !Array.isArray(counts.genome)) {
    return []
  }

  const genomeIndex = counts.genome.indexOf(genomeName)
  if (genomeIndex === -1) {
    return []
  }

  // Calculate totals for each sample
  const totals = Object.entries(counts).reduce((acc: Record<string, number>, [key, arr]) => {
    if (key === 'genome') return acc
    acc[key] = Array.isArray(arr)
      ? arr.reduce((sum: number, value: any) => sum + (parseFloat(value) || 0), 0)
      : 0
    return acc
  }, {})

  return Object.entries(counts)
    .filter(([key]) => key !== 'genome')
    .map(([id, arr]) => {
      const count = Array.isArray(arr) ? arr[genomeIndex] : undefined
      const countValue = parseFloat(count) || 0
      const total = totals[id] || 1
      const relativeAmount = countValue / total

      return {
        id,
        count: relativeAmount
      }
    })
    .filter(item => item.count > 0)
}