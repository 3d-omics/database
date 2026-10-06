import { useState, type ReactNode } from 'react'
import { getCoreRowModel, useReactTable, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, ColumnDef, type ColumnFiltersState } from '@tanstack/react-table'
import Pagination from 'components/Table/components/Pagination'
import TableHeader from './components/TableHeader'
import TableFilters from './components/TableFilters'
import TableBody from './components/TableBody'

type SortingState = {
  id: string
  desc: boolean
}[]

const Table = <TData,>({ data, columns, pageTitle, displayTableHeader = true, displayTableTitle = true, displayTableDescription = true, displayTableFilters = true, displayTableBody = true, tableDescription, initialColumnFilters = [], recordFilterControls }: {
  data: TData[],
  columns: ColumnDef<TData>[],
  pageTitle: string,
  displayTableHeader?: boolean
  displayTableTitle?: boolean
  displayTableDescription?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  tableDescription?: string
  initialColumnFilters?: ColumnFiltersState
  recordFilterControls?: ReactNode
}) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, })
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(undefined)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    initialState: { columnFilters: initialColumnFilters },
    state: { pagination, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  const filteredData = table.getFilteredRowModel().rows
  const filteredBy: ColumnFiltersState = table.getState().columnFilters
  const filteredAndSortedData = table.getSortedRowModel().rows
  const sortedBy: SortingState = table.getState().sorting

  return (
    <div className='' id='table-top'>
      {displayTableHeader &&
        <TableHeader
          pageTitle={pageTitle}
          displayTitle={displayTableTitle}
          filteredDataLength={filteredData.length}
          filteredAndSortedData={filteredAndSortedData}
          columns={columns}
          recordFilterControls={recordFilterControls}
        />
      }

      {displayTableDescription && tableDescription &&
        <p className='page_description'>
          {tableDescription}
        </p>
      }

      {displayTableFilters &&
        <TableFilters
          table={table}
          filteredBy={filteredBy}
          sortedBy={sortedBy}
        />
      }

      {displayTableBody &&
        <TableBody
          table={table}
          displayTableFilters={displayTableFilters}
        />
      }

      {filteredData.length === 0 ? (
        <div className='mt-10 font-extrabold text-2xl text-center'>
          No results match for this search criteria
        </div>
      ) : (
        <Pagination table={table} />
      )}
    </div>
  )
}

export default Table
