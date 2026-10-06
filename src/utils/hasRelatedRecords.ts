type RecordWithFields = { fields: Record<string, unknown> }

// Match the filters used by the embedded catalogue tables.
export const hasRelatedRecords = (
  records: readonly RecordWithFields[],
  field: string,
  id: string,
  condition: 'equals' | 'startsWith' = 'startsWith'
) => {
  const searchValue = id.toLowerCase()

  return records.some((record) => {
    const fieldValue = record.fields[field]
    if (fieldValue == null) return false

    const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue]
    return values.some((value) => {
      const candidate = String(value).toLowerCase()
      return condition === 'startsWith'
        ? candidate.startsWith(searchValue)
        : candidate === searchValue
    })
  })
}
