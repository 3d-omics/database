import { useState, useEffect } from 'react'
import Tabs from 'components/Tabs'
import MacrosampleTab from './components/MacrosampleTab'
import MicrosampleTab from './components/MicrosampleTab'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx'

type SampleData = Array<{ [key: string]: string }>

const SamplesContainingThisGenome = ({ genomeName }: {
  genomeName: string
}) => {
  const [selectedTab, setSelectedTab] = useState('Macrosample')
  const [macrosampleIds, setMacrosampleIds] = useState<SampleData>([])
  const [microsampleIds, setMicrosampleIds] = useState<SampleData | null>(null)
  const [isLoadingMacro, setIsLoadingMacro] = useState(true)
  const [isLoadingMicro, setIsLoadingMicro] = useState(true)
  const [macroError, setMacroError] = useState<string | null>(null)
  const [microError, setMicroError] = useState<string | null>(null)

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  // Fetch macrosample data
  const macroCsvFiles = import.meta.glob('../../../../assets/data/macro_genome_counts/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  })

  const macroCsvUrl = macroCsvFiles[`../../../../assets/data/macro_genome_counts/experiment_${experimentId}_counts.csv`]
  const { fetchExcel } = useFetchExcelFileData({ excelFile: macroCsvUrl })


  // Fetch microsample data
  const microCsvFiles = import.meta.glob('../../../../assets/data/microsample_counts/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  })

  const fetchExcelData = async (excelFile: string) => {
    try {
      const response = await fetch(excelFile)
      if (!response.ok) throw new Error("Failed to fetch the file")
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      if (!sheetName) throw new Error("The sheet you're looking for does not exist")
      const sheet = workbook.Sheets[sheetName]
      const rowData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      const columnData = rowData[0].reduce((acc, header, colIndex) => {
        acc[header] = rowData.slice(1).map(row => row[colIndex])
        return acc
      }, {})
      return columnData
    } catch (error) {
      console.error("Error reading Excel file:", error)
      throw error
    }
  }

  const processCounts = (counts: any, genomeName: string) => {
    if (!counts || !counts.genome || !Array.isArray(counts.genome)) {
      return []
    }
    const genomeIndex = counts.genome.indexOf(genomeName)
    if (genomeIndex === -1) {
      return []
    }
    return Object.entries(counts)
      .filter(([key]) => key !== "genome")
      .map(([id, arr]: [string, any]) => ({
        id,
        count: Array.isArray(arr) ? arr[genomeIndex] : undefined
      }))
      .filter(item => item.count)
  }

  useEffect(() => {
    const fetchMacroData = async () => {
      setIsLoadingMacro(true)
      setMacroError(null)
      try {
        const counts = await fetchExcel()
        const processed = processCounts(counts, genomeName)
        setMacrosampleIds(processed)
      } catch (error) {
        console.error("Error fetching macrosample data:", error)
        setMacroError(error instanceof Error ? error.message : "Failed to fetch macrosample data")
        setMacrosampleIds([])
      } finally {
        setIsLoadingMacro(false)
      }
    }

    fetchMacroData()
  }, [genomeName, experimentId])

  
  useEffect(() => {
    const fetchMicroData = async () => {
      setIsLoadingMicro(true)
      setMicroError(null)
      const allMicrosampleIds: SampleData = []
      let hasError = false

      for (const [path, csvUrl] of Object.entries(microCsvFiles)) {
        try {
          const counts = await fetchExcelData(csvUrl as string)
          const processed = processCounts(counts, genomeName)
          allMicrosampleIds.push(...processed)
        } catch (error) {
          console.error(`Error fetching ${path}:`, error)
          hasError = true
        }
      }

      if (hasError && allMicrosampleIds.length === 0) {
        setMicroError("Failed to fetch microsample data from all sources")
      } else if (hasError) {
        setMicroError("Some microsample data could not be fetched")
      }

      setMicrosampleIds(allMicrosampleIds)
      setIsLoadingMicro(false)
    }

    fetchMicroData()
  }, [genomeName])

  return (
    <div className=''>
      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={['Macrosample', 'Microsample']}
      />
      <div className='h-6'></div>
      {selectedTab === 'Macrosample' && (
        <MacrosampleTab 
          data={macrosampleIds} 
          genomeName={genomeName}
          isLoading={isLoadingMacro}
          error={macroError}
        />
      )}
      {selectedTab === 'Microsample' && (
        <MicrosampleTab 
          data={microsampleIds} 
          genomeName={genomeName}
          isLoading={isLoadingMicro}
          error={microError}
        />
      )}
    </div>
  )
}

export default SamplesContainingThisGenome