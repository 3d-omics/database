import { useState } from "react"
import * as XLSX from "xlsx"

const useFetchExcelFileData = ({ excelFile }: { excelFile: any }) => {

  const [fetchExcelError, setFetchExcelError] = useState<string | null>(null)

  const fetchExcel = async () => {
    try {
      const response = await fetch(excelFile)
      if (!response.ok) throw new Error("Failed to fetch the file")
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]; // sheet number
      if (!sheetName) throw new Error("The sheet you're looking for does not exist")
      const sheet = workbook.Sheets[sheetName];
      const rowData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      const columnData = rowData[0].reduce((acc, header, colIndex) => {
        acc[header] = rowData.slice(1).map(row => row[colIndex])
        return acc;
      }, {})
      return columnData
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error reading Excel file:", error.message)
        setFetchExcelError(error.message)
      } else {
        console.error("Error reading Excel file:", error)
        setFetchExcelError(String(error))
      }
      return null
    }
  }
  // const fetchExcel = async () => {
  //   try {
  //     const response = await fetch(excelFile)
  //     if (!response.ok) throw new Error("Failed to fetch the file")
  //     const arrayBuffer = await response.arrayBuffer()
  //     const workbook = XLSX.read(arrayBuffer, { type: "array" })
  //     const sheetName = workbook.SheetNames[0]; // sheet number
  //     if (!sheetName) throw new Error("The sheet you're looking for does not exist")
  //     const sheet = workbook.Sheets[sheetName];
  //     const rowData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  //     const columnData = rowData[0].reduce((acc, header, colIndex) => {
  //       acc[header] = rowData.slice(1).map(row => row[colIndex])
  //       return acc;
  //     }, {})
  //     return columnData
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error reading Excel file:", error.message)
  //       setFetchExcelError(error.message)
  //     } else {
  //       console.error("Error reading Excel file:", error)
  //       setFetchExcelError(String(error))
  //     }
  //     return null
  //   }
  // }

  return {
    fetchExcel,
    fetchExcelError
  }
}

export default useFetchExcelFileData