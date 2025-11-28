import { useState } from 'react'
import { getCoreRowModel, useReactTable, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, Column, ColumnDef, FilterFn, Row } from '@tanstack/react-table'
import Pagination from 'components/Table/components/Pagination'
import CompareSamplesButton from './components/CompareSamplesButton'
import TableHeader from './components/TableHeader'
import TableFilters from './components/TableFilters'
import TableBody from './components/TableBody'

type ColumnFiltersState = {
  id: string
  value: unknown
}[]

type SortingState = {
  id: string
  desc: boolean
}[]

const Table = <TData,>({ data, columns, pageTitle, displayTableHeader = true, displayTableFilters = true, displayTableBody = true, tableDescription }: {
  data: TData[],
  columns: ColumnDef<TData>[],
  pageTitle: string,
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  tableDescription?: string
}) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, })
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(undefined)
  const [checkedMetaboliteIds, setCheckedMetaboliteIds] = useState<string[]>([])
  const [checkedItems, setCheckedItems] = useState<any[]>([])

  const globalFilterFn: FilterFn<any> = (row: Row<any>, columnId: string, filterValue: string) => {
    const searchTerm = filterValue.toLowerCase()
    return row.getAllCells().some(cell => {
      const cellValue = String(cell.getValue()).toLowerCase()
      return cellValue.includes(searchTerm)
    })
  }

  const table = useReactTable({
    data,
    columns,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })


  const filteredData = table.getFilteredRowModel().rows
  const filteredBy: ColumnFiltersState = table.getState().columnFilters
  const filteredAndSortedData = table.getSortedRowModel().rows
  const sortedBy: SortingState = table.getState().sorting

  return (
    <div className='' id="table-top">
      {displayTableHeader &&
        <TableHeader
          pageTitle={pageTitle}
          filteredDataLength={filteredData.length}
          checkedItems={checkedItems}
          filteredAndSortedData={filteredAndSortedData}
          columns={columns}
        />
      }


      {tableDescription &&
        <div className='mb-8 text-sm text-custom_light_black max-w-3xl'>
          {tableDescription}
        </div>
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
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          checkedMetaboliteIds={checkedMetaboliteIds}
          setCheckedMetaboliteIds={setCheckedMetaboliteIds}
          displayTableFilters={displayTableFilters}
        />
      }

      {checkedMetaboliteIds.length > 0 && (
        <CompareSamplesButton
          samples={checkedMetaboliteIds}
          setSamples={setCheckedMetaboliteIds}
        />
      )}

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


