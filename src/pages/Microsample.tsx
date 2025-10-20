import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import { Link } from 'react-router-dom'
import TableView from 'components/TableView'
import { airtableConfig } from 'config/airtable'


export type TData = {
  id: string
  createdTime: string
  fields: {
    Code: string
    LMBatch: string
    LMBatch_flat: string
    Cryosection: string
    Cryosection_flat: string
    CollectionMethod: string
    Researcher: string
    Date: string
    Shape: string
    Xcoord: number
    Ycoord: number
    Size: number
    IntestinalSection?: string
    Number?: string
  }
}

const Microsample = ({ displayTableHeader, displayTableFilters, displayTableBody, filterWith = [] }: {
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  filterWith?: { id: string; value: string | number, condition?: string }[]
}) => {

  const { microsampleBaseId, microsampleTableId, microsampleViewId } = airtableConfig

  const { first100Data, first100Loading, first100Error, allData, allLoading, allError, } = useGetFirst100Data({
    AIRTABLE_BASE_ID: microsampleBaseId,
    AIRTABLE_TABLE_ID: microsampleTableId,
    AIRTABLE_VIEW_ID: microsampleViewId,
    filterWith,
  })

  const data = useMemo(() => {
    if (allData.length !== 0 && !allLoading) {
      return allData
    } else {
      return first100Data
    }
  }, [allData, first100Data, allLoading])

  // console.log(data.map((data) => data.fields))

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'Code',
      header: 'Code',
      accessorFn: (row) => row.fields.Code,
      // // to see the index
      //  cell: ({ cell, row }: { cell: { getValue: () => any }, row: any }) => {
      //   return <>
      //     <p>{cell.getValue() || 'unknown'}</p>
      //     <p>{row.index}</p>
      //   </>
      // },
    },
    {
      id: 'LMBatch_flat',
      header: 'LMBatch',
      accessorFn: (row) => row.fields.LMBatch_flat,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.LMBatch_flat))),
      },
    },
    {
      id: 'Cryosection_flat',
      header: 'Cryosection',
      accessorFn: (row) => row.fields.Cryosection_flat,
      // === for dropdown filter ===
      // meta: {
      //   filterVariant: 'select' as const,
      //   uniqueValues: Array.from(new Set(data.map((row) => row.fields.Cryosection_flat))),
      // },
      // === for cell with link to cryosection-view ===
      // cell: (props: any) => (
      //   <Link to={`/microsample-view?cryosectionSlide=${props.getValue().slice(0, -1)}`} className='link'>{props.getValue()}</Link>
      // )
    },
    {
      id: 'CollectionMethod',
      header: 'Collection Method',
      accessorFn: (row) => row.fields.CollectionMethod?.[0],
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.CollectionMethod?.[0]))),
      },
    },
    {
      id: 'Researcher',
      header: 'Researcher',
      accessorFn: (row) => row.fields.Researcher,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Researcher))),
      },
    },
    {
      id: 'Date',
      header: 'Date',
      accessorFn: (row) => row.fields.Date,
      enableColumnFilter: false,
    },
    {
      id: 'Shape',
      header: 'Shape',
      accessorFn: (row) => row.fields.Shape,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Shape))),
      },
    },
    {
      id: 'Xcoord',
      header: 'Xcoord',
      accessorFn: (row) => row.fields.Xcoord,
      enableColumnFilter: false,
    },
    {
      id: 'Ycoord',
      header: 'Ycoord',
      accessorFn: (row) => row.fields.Ycoord,
      enableColumnFilter: false,
    },
    {
      id: 'Size',
      header: 'Size',
      accessorFn: (row) => row.fields.Size,
      enableColumnFilter: false,
    },

    // ==================== ENA Accession Column ===========================
    {
      id: 'Number', // change "Number" to ENA Accession Code column id when the column is ready
      header: 'ENA Accession Code',
      accessorFn: (row) => row.fields.Number, // change "Number" to ENA Accession Code id column when the column is ready
      cell: ({ cell }: { cell: { getValue: () => any } }) => (
        <Link
          to={`https://www.ebi.ac.uk/ena/browser/view/${cell.getValue()}`}
          className='link'
          target='_blank'
          rel='noopener noreferrer'
        >
          {cell.getValue()}
        </Link>
      ),
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
      pageTitle={'Microsample'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default Microsample