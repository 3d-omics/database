import { useEffect, useState } from 'react'

export type MacrosampleIdentifiers = {
  material_biosample_accession: string | null
  sequencing_biosample_accessions: string[]
  material_insdc_sample_accessions: string[]
  sequencing_insdc_sample_accessions: string[]
}

export type MicrosampleIdentifiers = {
  sequencing_biosample_accessions: string[]
  sequencing_insdc_sample_accessions: string[]
}

type IdentifierKind = 'macro' | 'micro'

export default function useSampleIdentifiers<T>(kind: IdentifierKind, enabled = true): Record<string, T> {
  const [records, setRecords] = useState<Record<string, T>>({})

  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    const file = kind === 'macro' ? 'macrosample-identifiers.json' : 'microsample-identifiers.json'
    fetch(`${import.meta.env.BASE_URL}${file}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${file}`)
        return response.json() as Promise<{ macrosamples?: Record<string, T>; microsamples?: Record<string, T> }>
      })
      .then((data) => setRecords((kind === 'macro' ? data.macrosamples : data.microsamples) ?? {}))
      .catch((error) => {
        if (error?.name !== 'AbortError') console.error(error)
      })
    return () => controller.abort()
  }, [kind, enabled])

  return records
}
