import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table';
import TableView from 'components/TableView';
import cryosectionData from 'assets/data/airtable/cryosection.json'

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

  const data = cryosectionData as unknown as TData[]

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
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
      filterFn: 'equals',
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
      pageTitle={'Cryosection'}
    />
  )
}

export default Cryosection

