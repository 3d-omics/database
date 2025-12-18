import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import experimentG from 'assets/data/metabolomics/metabolomics_G.xlsx'
import experimentH from 'assets/data/metabolomics/metabolomics_H.xlsx'
import experimentI from 'assets/data/metabolomics/metabolomics_I.xlsx'
import experimentJ from 'assets/data/metabolomics/metabolomics_J.xlsx'
import experimentK from 'assets/data/metabolomics/metabolomics_K.xlsx'
import experimentM from 'assets/data/metabolomics/metabolomics_M.xlsx'

const useMetaboliteExcelFileData = ({ experimentId }: { experimentId: string }) => {

  // for original abundance
  const [originalColumnData, setOriginalColumnData] = useState<{ [key: string]: string[] }>({})
  const [fetchMetaboliteError, setFetchMetaboliteError] = useState<string | null>(null)

  // for normalized abundance
  const [normalizedColumnData, setNormalizedColumnData] = useState<{ [key: string]: string[] }>({})
  const [listOfSampleIdsThatHaveMetaboliteData, setListOfSampleIdsThatHaveMetaboliteData] = useState<string[]>([])

  const files = {
    'G': experimentG,
    'H': experimentH,
    'I': experimentI,
    'J': experimentJ,
    'K': experimentK,
    'M': experimentM
  }

  const fileToFetch = files[experimentId as keyof typeof files]


  useEffect(() => {

    const fetchExcel = async () => {
      try {
        const response = await fetch(fileToFetch)
        if (!response.ok) throw new Error('Failed to fetch the file')
        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        // Process Original Abundance
        const originalAbundanceSheet = workbook.SheetNames[3] // Sheet index 3 corresponds to 'Reordered Abundances'
        if (!originalAbundanceSheet) throw new Error('Excel sheet 3 does not exist')
        const sheet1 = workbook.Sheets[originalAbundanceSheet]
        const originalAbundancesRowData: any[][] = XLSX.utils.sheet_to_json(sheet1, { header: 1 })
        setListOfSampleIdsThatHaveMetaboliteData(originalAbundancesRowData[0]?.filter((item: string) => item !== 'Feature_ID' && item !== 'Curated_ID'))
        const originalAbundancesColumnData = originalAbundancesRowData[0].reduce((acc, header, colIndex) => {
          acc[header] = originalAbundancesRowData.slice(1).map(row => row[colIndex])
          return acc
        }, {})
        setOriginalColumnData(originalAbundancesColumnData)

        // Process Normalized Abundance
        const normalizedAbundanceSheet = workbook.SheetNames[4] // Sheet index 4 corresponds to 'Normalized Abundances'
        if (!normalizedAbundanceSheet) throw new Error('Excel sheet 4 does not exist')
        const sheet2 = workbook.Sheets[normalizedAbundanceSheet]
        const normalizedAbundancesRowData: any[][] = XLSX.utils.sheet_to_json(sheet2, { header: 1 })
        const normalizedAbundancesColumnData = normalizedAbundancesRowData[0].reduce((acc, header, colIndex) => {
          acc[header] = normalizedAbundancesRowData.slice(1).map(row => row[colIndex])
          return acc
        }, {})
        setNormalizedColumnData(normalizedAbundancesColumnData)

      } catch (error) {
        if (error instanceof Error) {
          setFetchMetaboliteError(error.message)
        } else {
          setFetchMetaboliteError(String(error))
        }
      }
    }
    fetchExcel()
  }, [experimentId, fileToFetch])


  return {
    listOfSampleIdsThatHaveMetaboliteData,
    listOfCuratedIdsOfMetabolites: normalizedColumnData.Curated_ID,
    originalColumnData,
    normalizedColumnData,
    fetchMetaboliteError
  }
}

export default useMetaboliteExcelFileData