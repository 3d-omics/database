import DebouncedInput from './DebouncedInput'
import { Column } from '@tanstack/react-table'

const Filter = <TData,>({ column }: { column: Column<TData> }) => {

  const columnFilterValue = column.getFilterValue()
  const { filterVariant, uniqueValues } = (column.columnDef.meta ?? {}) as { filterVariant?: string; uniqueValues?: string[] }
  
  const filteredUniqueValues = uniqueValues?.filter(value => value !== undefined)

  return filterVariant === 'select'
    ? (
      <div className="dropdown w-full">
        <select
          className="btn mt-2 btn-xs text-left w-full"
          onChange={e => column.setFilterValue(e.target.value)}
          value={columnFilterValue ? columnFilterValue.toString() : ''}
          id={column.id}
        >
          <option value=''>All</option>
          {filteredUniqueValues?.map((value, i) => (
            <option key={i}>{value}</option>
          ))}
        </select>
      </div>
    ) : (
      <DebouncedInput
        onChange={(value: string | number) => column.setFilterValue(value)}
        placeholder={`Search...`}
        type="text"
        value={(columnFilterValue ?? '') as string}
        id={column.id}
      />
    )
}

export default Filter