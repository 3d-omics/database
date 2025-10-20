import { useEffect, useState } from 'react'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import { useParams } from 'react-router-dom'
import TableBody from 'components/Table/components/TableBody'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import * as XLSX from 'xlsx'


const MicrosampleTab = () => {

  const fetchExcelData = async (excelFile: string) => {
    try {
      const response = await fetch(excelFile)
      if (!response.ok) throw new Error("Failed to fetch the file")
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("The sheet you're looking for does not exist")
      const sheet = workbook.Sheets[sheetName];
      const rowData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      const columnData = rowData[0].reduce((acc, header, colIndex) => {
        acc[header] = rowData.slice(1).map(row => row[colIndex])
        return acc;
      }, {})
      return columnData
    } catch (error) {
      console.error("Error reading Excel file:", error)
      return null
    }
  }

  const [microsampleIds, setMicrosampleIds] = useState<Array<{ [key: string]: string }>>([])

  const { genomeName = '' } = useParams()

  const csvFiles = import.meta.glob('../../../../../assets/data/microsample_counts/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  });

  useEffect(() => {
    const fetchAllCsvs = async () => {
      const allMicrosampleIds: Array<{ microsampleId: string; count: any }> = []

      for (const [path, csvUrl] of Object.entries(csvFiles)) {
        try {
          const counts = await fetchExcelData(csvUrl as string)

          if (!counts || !counts.genome || !Array.isArray(counts.genome)) {
            continue
          }

          const genomeIndex = counts.genome.indexOf(genomeName)
          if (genomeIndex === -1) {
            continue
          }

          const microsampleIdsWithValues = Object.entries(counts)
            .filter(([key]) => key !== "genome")
            .map(([microsampleId, arr]: [string, any]) => ({
              microsampleId,
              count: Array.isArray(arr) ? arr[genomeIndex] : undefined
            }))
            .filter(item => item.count)

          allMicrosampleIds.push(...microsampleIdsWithValues)
        } catch (error) {
          console.error(`Error fetching ${path}:`, error)
        }
      }

      setMicrosampleIds(allMicrosampleIds)
    }

    fetchAllCsvs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genomeName])

  // console.log(microsampleIds)

  const columns = [
    {
      id: 'microsampleId',
      header: 'Microsample ID',
      accessorKey: 'microsampleId',
    },
    {
      id: 'count',
      header: 'Count',
      accessorKey: 'count',
    }
  ]

  const table = useReactTable({
    data: microsampleIds,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <div>
      {microsampleIds.length > 0
        ? <div>
          <p className='mb-4 text-lg'><b>{microsampleIds.length}</b> {microsampleIds.length === 1 ? 'microsample' : 'microsamples'} containing <b>{genomeName}</b></p>
          <TableBody
            table={table}
            checkedItems={[]}
            setCheckedItems={() => { }}
            checkedMetaboliteIds={[]}
            setCheckedMetaboliteIds={() => { }}
            displayTableFilters={false}
          />
        </div>
        : <p className=''>No microsamples containing <b>{genomeName}</b> were found.</p>
      }

    </div>
  )
}

export default MicrosampleTab