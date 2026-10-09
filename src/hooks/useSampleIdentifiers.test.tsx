import { afterEach, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useSampleIdentifiers, { MacrosampleIdentifiers } from './useSampleIdentifiers'

afterEach(() => vi.unstubAllGlobals())

it('loads the macrosample crosswalk from the site base path on demand', async () => {
  const sample = {
    material_biosample_accession: 'SAMEA120503856',
    sequencing_biosample_accessions: [],
    material_insdc_sample_accessions: ['ERS27204543'],
    sequencing_insdc_sample_accessions: [],
  }
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ macrosamples: { C002aI: sample } }) })
  vi.stubGlobal('fetch', fetchMock)

  const { result } = renderHook(() => useSampleIdentifiers<MacrosampleIdentifiers>('macro'))
  await waitFor(() => expect(result.current.C002aI).toEqual(sample))
  expect(fetchMock).toHaveBeenCalledWith('/database/macrosample-identifiers.json', expect.objectContaining({ signal: expect.any(AbortSignal) }))
})

it('does not fetch when the material crosswalk is unnecessary', () => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  renderHook(() => useSampleIdentifiers<MacrosampleIdentifiers>('macro', false))
  expect(fetchMock).not.toHaveBeenCalled()
})
