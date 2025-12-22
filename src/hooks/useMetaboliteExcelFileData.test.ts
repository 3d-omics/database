import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useMetaboliteExcelFileData from './useMetaboliteExcelFileData'
import * as XLSX from 'xlsx'

// Mock XLSX
vi.mock('xlsx', () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn(),
  },
}))

// Mock Excel file imports
vi.mock('assets/data/metabolomics/metabolomics_G.xlsx', () => ({ default: 'mock-g.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_H.xlsx', () => ({ default: 'mock-h.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_I.xlsx', () => ({ default: 'mock-i.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_J.xlsx', () => ({ default: 'mock-j.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_K.xlsx', () => ({ default: 'mock-k.xlsx' }))
vi.mock('assets/data/metabolomics/metabolomics_M.xlsx', () => ({ default: 'mock-m.xlsx' }))

describe('useMetaboliteExcelFileData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('returns initial state structure', async () => {
    const { result } = renderHook(() => useMetaboliteExcelFileData({ experimentId: 'G' }))

    await waitFor(() => {
      expect(result.current).toHaveProperty('listOfSampleIdsThatHaveMetaboliteData')
    })

    expect(result.current).toHaveProperty('listOfCuratedIdsOfMetabolites')
    expect(result.current).toHaveProperty('originalColumnData')
    expect(result.current).toHaveProperty('normalizedColumnData')
    expect(result.current).toHaveProperty('fetchMetaboliteError')
    expect(result.current).toHaveProperty('sampleMetaDataSheet')
  })

  it('processes Excel data successfully', async () => {
    const mockAbundanceData = [
      ['Feature_ID', 'Curated_ID', 'Sample1', 'Sample2'],
      ['F1', 'C1', '10', '20'],
      ['F2', 'C2', '30', '40'],
    ]

    const mockMetadataData = [
      ['Sample_ID', 'Treatment', 'DPI'],
      ['Sample1', 'T1', '0'],
      ['Sample2', 'T2', '7'],
    ]

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    })

    ;(XLSX.read as any).mockReturnValue({
      SheetNames: ['Sheet0', 'Metadata', 'Sheet2', 'Original', 'Normalized'],
      Sheets: {
        Metadata: {},
        Original: {},
        Normalized: {},
      },
    })

    // Mock sheet_to_json to return different data based on which sheet
    ;(XLSX.utils.sheet_to_json as any)
      .mockReturnValueOnce(mockAbundanceData) // First call - Original Abundance (index 3)
      .mockReturnValueOnce(mockAbundanceData) // Second call - Normalized Abundance (index 4)
      .mockReturnValueOnce(mockMetadataData) // Third call - Sample Metadata (index 1)

    const { result } = renderHook(() => useMetaboliteExcelFileData({ experimentId: 'G' }))

    await waitFor(() => {
      expect(result.current.listOfSampleIdsThatHaveMetaboliteData).toEqual(['Sample1', 'Sample2'])
    })

    expect(result.current.listOfCuratedIdsOfMetabolites).toBeDefined()
    expect(result.current.sampleMetaDataSheet).toEqual(mockMetadataData)
    expect(result.current.fetchMetaboliteError).toBeNull()
  })

  it('skips fetching when skip is true', async () => {
    const { result } = renderHook(() => useMetaboliteExcelFileData({ experimentId: 'G', skip: true }))

    // Wait a bit to ensure no fetch happens
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.listOfSampleIdsThatHaveMetaboliteData).toEqual([])
    expect(result.current.fetchMetaboliteError).toBeNull()
    expect(result.current.sampleMetaDataSheet).toBeNull()
  })

  it('handles fetch errors', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
    })

    const { result } = renderHook(() => useMetaboliteExcelFileData({ experimentId: 'G' }))

    await waitFor(() => {
      expect(result.current.fetchMetaboliteError).toBe('Failed to fetch the file')
    })
  })

  it('handles missing Excel sheets', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    })

    ;(XLSX.read as any).mockReturnValue({
      SheetNames: ['Sheet0', 'Sheet1'],
      Sheets: {},
    })

    const { result } = renderHook(() => useMetaboliteExcelFileData({ experimentId: 'G' }))

    await waitFor(() => {
      expect(result.current.fetchMetaboliteError).toContain('does not exist')
    })
  })

  it('refetches when experimentId changes', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    })

    ;(XLSX.read as any).mockReturnValue({
      SheetNames: ['S0', 'S1', 'S2', 'S3', 'S4'],
      Sheets: { S1: {}, S3: {}, S4: {} },
    })

    ;(XLSX.utils.sheet_to_json as any).mockReturnValue([['Feature_ID']])

    const { rerender } = renderHook(
      ({ experimentId }) => useMetaboliteExcelFileData({ experimentId }),
      { initialProps: { experimentId: 'G' } }
    )

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    rerender({ experimentId: 'H' })

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2))
  })
})