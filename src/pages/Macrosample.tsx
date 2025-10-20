import { useMemo } from 'react'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import { airtableConfig } from 'config/airtable'

export type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    ExperimentalUnitIndexedLibrary: string
  }
}

const Macrosample = ({ displayTableHeader, displayTableFilters, displayTableBody, filterWith = [] }: {
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  filterWith?: { id: string; value: string | number, condition?: string }[]
}) => {

  const { macrosampleBaseId, macrosampleTableId, macrosampleViewId } = airtableConfig

  const { first100Data, first100Loading, first100Error, allData, allLoading, allError, } = useGetFirst100Data({
    AIRTABLE_BASE_ID: macrosampleBaseId,
    AIRTABLE_TABLE_ID: macrosampleTableId,
    AIRTABLE_VIEW_ID: macrosampleViewId,
    filterWith,
  })

  const data = useMemo(() => {
    if (allData.length !== 0 && !allLoading) {
      return allData
    } else {
      return first100Data
    }
  }, [allData, first100Data, allLoading])

  // console.log(allData.map((d) => d.fields))

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
    },
    {
      id: 'ExperimentalUnitIndexedLibrary',
      header: 'Animal Specimen ID',
      accessorFn: (row) => row.fields.ExperimentalUnitIndexedLibrary?.[0],
    },
  ], [data])



  return (
    <TableView<TData>
      data={data}
      columns={columns}
      first100Loading={first100Loading}
      allLoading={allLoading}
      first100Error={first100Error}
      allError={allError}
      pageTitle={'Macrosample'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default Macrosample