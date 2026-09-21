export type CatalogueFields = {
  'MAG catalogue - Number of MAGs'?: number
  'MAG catalogue - Average completeness (%)'?: number
  'MAG catalogue - Average contamination (%)'?: number
  'MAG catalogue - New species (%)'?: number
}

const toPercent = (value: number | undefined, options: Intl.NumberFormatOptions) =>
  value == null ? undefined : `${value.toLocaleString('en-US', options)}%`
const twoDecimals = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

// A catalogue's headline figures, formatted alike on the list and on its own page.
// A figure missing from the catalogue has no value
export const getSummaryStats = (fields: CatalogueFields) => [
  { label: 'Number of MAGs', value: fields['MAG catalogue - Number of MAGs']?.toLocaleString('en-US') },
  { label: 'Average completeness', value: toPercent(fields['MAG catalogue - Average completeness (%)'], twoDecimals) },
  { label: 'Average contamination', value: toPercent(fields['MAG catalogue - Average contamination (%)'], twoDecimals) },
  { label: 'New species', value: toPercent(fields['MAG catalogue - New species (%)'], { maximumFractionDigits: 2 }) },
]
