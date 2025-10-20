import { ColumnDef } from '@tanstack/react-table'
import DownloadTSVButton from './DownloadTSVButton'

interface TableHeaderProps<TData> {
  pageTitle: string
  filteredDataLength: number
  checkedItems: any[]
  filteredAndSortedData: any[]
  columns: ColumnDef<TData>[]
}

const TableHeader = <TData,>({
  pageTitle,
  filteredDataLength,
  checkedItems,
  filteredAndSortedData,
  columns
}: TableHeaderProps<TData>) => {
  return (
    <section className='z-20 bg-white flex justify-between items-center pb-5 max-md:flex-col max-md:items-start'>
      <div className='flex gap-4 items-center max-sm:block'>
        <header className='main_header max-sm:mb-1.5'>{pageTitle}</header>
        <section className='flex items-center text-sm max-sm:text-xs'>
          <div className='mr-6 p-2 bg-light_mustard rounded-md max-sm:p-1'>
            <b>{filteredDataLength}</b> records
          </div>
        </section>
      </div>

      <div className='flex gap-4 max-md:pt-4 max-sm:flex-col max-sm:items-start max-sm:gap-0.5'>
        {checkedItems.length > 0 && (
          <div
            className='max-sm:pt-1 tooltip tooltip-bottom z-[22]' // Make this z-index stronger that the other Download button for when responsive (so that it goes over the other button)
            data-testid='download-selected-tsv-button-wrapper'
            data-tip="only the rows you've checked"
          >
            <DownloadTSVButton<TData>
              filteredAndSortedData={checkedItems}
              columns={columns}
              fileTitle={pageTitle}
              buttonLabel={`Download Selected (${checkedItems.length}) as TSV`}
            />
          </div>
        )}
        <div
          className='max-sm:pt-1 z-[21]'
          data-testid='download-all-tsv-button-wrapper'
        // className='max-sm:pt-1 tooltip tooltip-bottom z-[21]'
        // data-tip="all filtered + sorted items"
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
