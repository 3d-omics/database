import { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Row, ColumnDef } from '@tanstack/react-table'

type DataItem = {
  [key: string]: string | number
}

const DownloadTSVButton = <TData,>({ filteredAndSortedData, columns, fileTitle, buttonLabel }: { filteredAndSortedData: Row<TData>[], columns: ColumnDef<TData>[], fileTitle: string, buttonLabel: string }) => {

  const convertToTSV = (data: DataItem[]) => {
    const headers = columns.map((column) => column.header).join('\t')
    const rows = data.map((row) => Object.values(row as object).join('\t')).join('\n')
    return `${headers}\n${rows}`
  }

  const filteredAndSortedDataWithExistingColumns = useMemo(() => {
    return filteredAndSortedData.map((row: any) => {
      const visibleRow: DataItem = {}
      columns.forEach((column) => {
        //　⬇️ before ading circos table
        // if (column.id) visibleRow[column.id] = row.original.fields[column.id];

        if (column.id) {
          if (column.id === 'taxonomy') {
            visibleRow[column.id] = row.renderValue('taxonomy')
          } else
            if (row.original.fields) {
              visibleRow[column.id] = row.original.fields[column.id];
            } else {
              visibleRow[column.id] = row.original[column.id];
            }
        }

      })
      return visibleRow
    })
  }, [filteredAndSortedData, columns])

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
