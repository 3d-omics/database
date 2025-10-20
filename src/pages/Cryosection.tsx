import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table';
import useGetFirst100Data from 'hooks/useGetFirst100Data';
import { CellContext } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import TableView from 'components/TableView';
import { airtableConfig } from 'config/airtable'

export type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    Slide: string
    Slide_flat: string
    Position: string
    SlideDate: string
    IntestinalSection?: string[]
    Microsample?: string[]
    SlideImage?: {
      filename: string
      height: number
      id: number
      size: number
      thumbnails: {
        full: {
          height: number
          url: string
          width: number
        },
        large: {
          height: number
          url: string
          width: number
        },
        small: {
          height: number
          url: string
          width: number
        }
      },
      type: string
      url: string
      width: number
    }[]
  }
}

const Cryosection = () => {

  const { cryosectionBaseId, cryosectionTableId, cryosectionViewId } = airtableConfig

  const { first100Data, first100Loading, first100Error, allData, allLoading, allError, } = useGetFirst100Data({
    AIRTABLE_BASE_ID: cryosectionBaseId,
    AIRTABLE_TABLE_ID: cryosectionTableId,
    AIRTABLE_VIEW_ID: cryosectionViewId,
  })

  const data = useMemo(() => {
    if (allData.length !== 0 && !allLoading) {
      return allData
    } else {
      return first100Data
    }
  }, [allData, first100Data, allLoading])

  // console.log(data.map((data)=> data.fields))


  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
      // // to see the index
      //  cell: ({ cell, row }: { cell: { getValue: () => any }, row: any }) => {
      //   return <>
      //     <p>{cell.getValue() || 'unknown'}</p>
      //     <p>{row.index}</p>
      //   </>
      // },
    },
    {
      id: 'Slide_flat',
      header: 'Slide',
      accessorFn: (row) => row.fields.Slide_flat,
      // === for dropdown filter ===
      // meta: {
      //   filterVariant: 'select' as const,
      //   uniqueValues: Array.from(new Set(data.map((row) => row.fields.Slide_flat))),
      // },
      // === for cell with link to cryosection-view ===
      // cell: (props: any) => (
      //   <Link to={`/cryosection-view?cryosectionSlide=${props.getValue()}`} className='link'>{props.getValue()}</Link>
      // )
    },
    {
      id: 'Position',
      header: 'Position',
      accessorFn: (row) => row.fields.Position,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Position))),
      },
    },
    {
      id: 'SlideDate',
      header: 'Slide Date',
      accessorFn: (row) => row.fields.SlideDate,
      enableColumnFilter: false,
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
      pageTitle={'Cryosection'}
    />
  )
}

export default Cryosection