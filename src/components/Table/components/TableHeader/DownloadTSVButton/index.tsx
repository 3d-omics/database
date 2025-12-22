import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Row, ColumnDef } from '@tanstack/react-table'
import { getExperimentOptions } from 'config/metaboliteOptions'

type DataItem = {
  [key: string]: string | number
}

const DownloadTSVButton = <TData,>({
  filteredAndSortedData,
  columns,
  fileTitle,
  buttonLabel
}: {
  filteredAndSortedData: Row<TData>[],
  columns: ColumnDef<TData>[],
  fileTitle: string,
  buttonLabel: string
}) => {

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  // Filter out columns that shouldn't be exported
  const exportableColumns = useMemo(() => {
    return columns.filter((column) => {
      if (column.id === 'Metabolite') return false
      if (column.id === 'MAGCatalogue') return false
      if (typeof column.header === 'function') return false
      return true
    })
  }, [columns])

  // Create value transformers based on experiment options
  const valueTransformers = useMemo(() => {
    if (!experimentId) return {}
    const allOptions = getExperimentOptions(experimentId)
    const transformers: Record<string, (value: any) => string> = {}
    // Dynamically create transformers for all available options
    Object.entries(allOptions).forEach(([columnName, mappings]) => {
      transformers[columnName] = (value: any) => {
        if (value == null || value === '') return value
        return mappings[String(value)] || value
      }
    })

    return transformers
  }, [experimentId])

  const convertToTSV = (data: DataItem[]) => {
    const headers = exportableColumns.map((column) => column.header).join('\t')
    const rows = data.map((row) => Object.values(row as object).join('\t')).join('\n')
    return `${headers}\n${rows}`
  }

  const filteredAndSortedDataWithExistingColumns = useMemo(() => {
    return filteredAndSortedData.map((row: any) => {
      const visibleRow: DataItem = {}
      exportableColumns.forEach((column) => {
        if (column.id) {
          let value: any

          if (column.id === 'taxonomy') {
            value = row.renderValue('taxonomy')
          } else if (row.original.fields) {
            value = row.original.fields[column.id]
          } else {
            value = row.original[column.id]
          }

          // Apply value transformer if available for this column
          if (valueTransformers[column.id] && value != null) {
            value = valueTransformers[column.id](value)
          }

          visibleRow[column.id] = value
        }
      })
      return visibleRow
    })
  }, [filteredAndSortedData, exportableColumns, valueTransformers])

  const handleDownload = () => {
    const tsvData = convertToTSV(filteredAndSortedDataWithExistingColumns)
    const blob = new Blob([tsvData], { type: 'text/tab-separated-values' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileTitle}.tsv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      className='btn btn-outline btn-xs min-w-max bg-white text-custom_black hover:bg-custom_black hover:border-custom_black'
      onClick={handleDownload}
    >
      <FontAwesomeIcon icon={faFileArrowDown} className='-mr-0.5' data-testid='download-tsv-icon' />
      <span className='whitespace-nowrap'>{buttonLabel}</span>
    </button>
  )
}

export default DownloadTSVButton