import { ReactNode } from 'react'
import { Table } from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { formatIdForDisplay, deleteFilter } from './utils/filterUtils'

type ColumnFiltersState = {
  id: string
  value: unknown
}[]

type SortingState = {
  id: string
  desc: boolean
}[]

interface TableFiltersProps {
  table: Table<any>
  filteredBy: ColumnFiltersState
  sortedBy: SortingState
}

const TableFilters = ({ table, filteredBy, sortedBy }: TableFiltersProps) => {

  if (filteredBy.length === 0 && sortedBy.length === 0) {
    return null
  }

  return (
    <section className='z-20 bg-white flex items-center text-xs max-sm:block pb-4'>
      <div className='flex my-1 items-center max-sm:items-start'>
        {filteredBy.length !== 0 && (
          <>
            Filtered by
            <div className='mr-6 flex max-sm:flex-col max-sm:gap-1'>
              {filteredBy.map((filter, i) => (
                <p key={filter.id} className='bg-light_mustard w-fit rounded-md flex items-center ml-1 p-2 font-bold max-sm:p-1'>
                  <span className='capitalize mr-1 font-thin'>{formatIdForDisplay(filter.id)}:</span>
                  <span>{filter.value as ReactNode}</span>
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => table.setColumnFilters(deleteFilter(i, filteredBy))}
                    className='cursor-pointer pl-3'
                    title='Remove filter'
                    data-testid={`remove-filter-icon-for-${filter.id}`}
                  />
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      <div className='flex my-1 items-center'>
        {sortedBy.length !== 0 && (
          <>
            Sorted by
            <div className='mr-6 flex'>
              {sortedBy.map((sort) => (
                <p key={sort.id} className='bg-light_mustard rounded-md flex items-center ml-1 p-2 font-bold max-sm:p-1'>
                  <span className='capitalize mr-1 font-thin'>{formatIdForDisplay(sort.id)}:</span>
                  <span>{sort.desc ? 'descending' : 'ascending'}</span>
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => table.setSorting([])}
                    className='cursor-pointer pl-3'
                    title='Remove sort'
                    data-testid={`remove-sort-icon-for-${sort.id}`}
                  />
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default TableFilters