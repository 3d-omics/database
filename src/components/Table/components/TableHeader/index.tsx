import { ColumnDef } from '@tanstack/react-table'
import DownloadTSVButton from './DownloadTSVButton'


const TableHeader = <TData,>({
  pageTitle,
  filteredDataLength,
  filteredAndSortedData,
  columns
}: {
  pageTitle: string
  filteredDataLength: number
  filteredAndSortedData: any[]
  columns: ColumnDef<TData>[]
}) => {
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
