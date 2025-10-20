export const formatIdForDisplay = (id: string) => {
  if (id === 'ID') return 'ID'
  if (id === 'LMBatch_flat') return 'LMBatch'
  if (id === 'Individual') return 'Experimental Unit Series'
  if (id === 'Metabolite') return 'Metabolite Data'
  if (id.includes('_flat')) return id.replace('_flat', '')
  return id.replace(/([A-Z])/g, ' $1').trim()
}

export const deleteFilter = (
  i: number,
  filteredBy: { id: string; value: unknown }[] | []
) => {
  const newFilters = [...filteredBy]
  newFilters.splice(i, 1)
  return newFilters
}