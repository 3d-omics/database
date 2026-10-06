import { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import DownloadTSVButton from './DownloadTSVButton'


const TableHeader = <TData,>({
  pageTitle,
  displayTitle = true,
  filteredDataLength,
  filteredAndSortedData,
  columns,
  recordFilterControls,
}: {
  pageTitle: string
  displayTitle?: boolean
  filteredDataLength: number
  filteredAndSortedData: any[]
  columns: ColumnDef<TData>[]
  recordFilterControls?: ReactNode
}) => {
  return (
    <section className='z-20 bg-surface flex justify-between items-center pb-5 max-md:flex-col max-md:items-start'>
      <div className='flex flex-wrap gap-x-4 gap-y-3 items-center'>
        {displayTitle && <h2 className='main_header max-sm:mb-1.5'>{pageTitle}</h2>}
        <div className='flex flex-wrap items-center gap-3 text-sm max-sm:text-xs'>
          <span className='whitespace-nowrap rounded-md bg-light_mustard p-2 text-custom_black max-sm:p-1'>
            <b>{filteredDataLength}</b> records
          </span>
          {recordFilterControls}
        </div>
      </div>

      <div className='flex gap-4 max-md:pt-4 max-sm:flex-col max-sm:items-start max-sm:gap-0.5'>
        <div
          className='max-sm:pt-1 z-[21]'
        >
          <DownloadTSVButton<TData>
            filteredAndSortedData={filteredAndSortedData}
            columns={columns}
            fileTitle={pageTitle}
            buttonLabel={'Download as TSV'}
          />
        </div>
      </div>
    </section>
  )
}

export default TableHeader
