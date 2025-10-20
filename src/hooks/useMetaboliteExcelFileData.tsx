import { useState, useEffect } from 'react'
import * as XLSX from "xlsx"
import excelFile from "assets/data/metabolomics.xlsx"

const useMetaboliteExcelFileData = () => {

  // for original abundance
  const [originalColumnData, setOriginalColumnData] = useState<{ [key: string]: string[] }>({ curatedId: [] })
  const [originalRowData, setOriginalRowData] = useState<any[]>([])
  const listOfSampleIdsThatHaveMetaboliteData: string[] = originalRowData[0]?.slice(2, 145) // sample IDs are from column C(2) to EO(145)
  const [fetchMetaboliteError, setFetchMetaboliteError] = useState<string | null>(null)

  // for normalized abundance
  const [normalizedColumnData, setNormalizedColumnData] = useState<{ [key: string]: string[] }>({ curatedId: [] })


  useEffect(() => {

    const fetchExcel = async () => {
      try {
        const response = await fetch(excelFile)
        if (!response.ok) throw new Error("Failed to fetch the file")
        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })

        // Process first sheet
        const originalAbundanceSheet = workbook.SheetNames[3] // Sheet index 3 corresponds to "Abundances to Curated ID"
        // const originalAbundanceSheet = workbook.SheetNames[0]
        if (!originalAbundanceSheet) throw new Error("Excel sheet 0 does not exist")
        const sheet1 = workbook.Sheets[originalAbundanceSheet]
        const originalAbundancesRowData: any[][] = XLSX.utils.sheet_to_json(sheet1, { header: 1 })
        setOriginalRowData(originalAbundancesRowData)
        const originalAbundancesColumnData = originalAbundancesRowData[0].reduce((acc, header, colIndex) => {
          acc[header] = originalAbundancesRowData.slice(1).map(row => row[colIndex])
          return acc
        }, {})
        setOriginalColumnData(originalAbundancesColumnData)

        // Process second sheet
        const normalizedAbundanceSheet = workbook.SheetNames[4] // Sheet index 4 corresponds to "Normalized Abundances"
        // const normalizedAbundanceSheet = workbook.SheetNames[1]
        if (!normalizedAbundanceSheet) throw new Error("Excel sheet 1 does not exist")
        const sheet2 = workbook.Sheets[normalizedAbundanceSheet]
        const normalizedAbundancesRowData: any[][] = XLSX.utils.sheet_to_json(sheet2, { header: 1 })
        // setNormalizedRowData(normalizedAbundancesRowData)
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

  }, [])


  return {
    listOfSampleIdsThatHaveMetaboliteData,
    listOfCuratedIdsOfMetabolites: originalColumnData.curatedId,
    originalColumnData,
    normalizedColumnData,
    fetchMetaboliteError
  }
}

export default useMetaboliteExcelFileData