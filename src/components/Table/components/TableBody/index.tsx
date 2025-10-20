import { Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import Filter from './components/Filter/Filter'
import MetaboliteColumn from './components/MetaboliteColumn'

interface TableBodyProps {
  table: Table<any>
  checkedItems: any[]
  setCheckedItems: React.Dispatch<React.SetStateAction<any[]>>
  checkedMetaboliteIds: string[]
  setCheckedMetaboliteIds: React.Dispatch<React.SetStateAction<string[]>>
  displayTableFilters?: boolean
}

const TableBody = ({
  table,
  checkedItems,
  setCheckedItems,
  checkedMetaboliteIds,
  setCheckedMetaboliteIds,
  displayTableFilters = true
}: TableBodyProps) => {
  return (
    <main className='max-lg:overflow-x-auto max-lg:max-h-[calc(100dvh-264px)] mb-[66px]'>
      <table className='table table-sm' data-testid='table'>
        <thead className='sticky bg-white z-20 top-[66px] shadow-[0px_4px_3px_-3px_rgba(0,0,0,0.1)] max-lg:top-[-1px]'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='[&>th]:pb-4'>
              {/* ⬇️ <th> for checkbox input for selecting for download TSV */}
              {/* <th></th> */}
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      {displayTableFilters
                        ? (
                          <div
                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() === 'desc'
                                    ? 'Sort descending'
                                    : 'Clear sort'
                                : undefined
                            }
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() ? (
                              {
                                asc: <FontAwesomeIcon icon={faSortUp} className='ml-2' />,
                                desc: <FontAwesomeIcon icon={faSortDown} className='ml-2' />,
                              }[header.column.getIsSorted() as string] ?? (
                                <FontAwesomeIcon
                                  icon={faSort}
                                  className='ml-2'
                                  data-testid={`sort-icon-for-${header.id}`}
                                />
                              )
                            ) : null}
                          </div>
                        ) : (
                          <div className='cursor-default select-none'>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )
                      }


                      {displayTableFilters && header.column.getCanFilter() && (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className='bg-neutral-50 odd:[&>tr]:bg-neutral-200 hover:[&>tr]:bg-light_burgundy hover:[&>tr]:text-white'>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {/* ⬇️ Column for checkbox input for selecting for download TSV */}
              {/* <td>
                <input
                  type='checkbox'
                  className='accent-mustard'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedItems(prev => [...prev, row])
                    } else {
                      setCheckedItems(prev => prev.filter((item) => item.id !== row.id))
                    }
                  }}
                  id={row.id}
                  checked={checkedItems.some(item => item.id === row.id)}
                />
              </td> */}
              {row.getVisibleCells().map(cell => {
                if (cell.column.id === 'Metabolite') {
                  return (
                    <td key={cell.id} className='text-center'>
                      <MetaboliteColumn
                        cell={cell}
                        checkedMetaboliteIds={checkedMetaboliteIds}
                        setCheckedMetaboliteIds={setCheckedMetaboliteIds}
                      />
                    </td>
                  )
                }
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default TableBody