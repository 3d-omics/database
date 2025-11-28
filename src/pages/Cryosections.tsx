import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table';
import TableView from 'components/TableView';
import cryosectionData from 'assets/data/airtable/cryosection.json'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'
import { Link } from 'react-router-dom'

export type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    Slide: string
    Slide_flat: string
    Position: string
    SlideDate: string
    Macrosample: string
    "Microsample number": number
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

const Cryosection = ({
  displayTableHeader,
  displayTableFilters,
  displayTableBody,
  filterWith = [],
}: {
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  filterWith?: { id: keyof TData['fields']; value: string | number; condition?: 'startsWith' | 'equals' }[]
}) => {

  const data = cryosectionData as unknown as TData[]

  const tableDescription = ""

  const filteredData = useMemo(() => {
    if (!filterWith || filterWith.length === 0) {
      return data
    }

    return (data).filter((record) => {
      return filterWith.every((filter) => {
        const fieldValue = record.fields[filter.id]

        if (fieldValue === undefined || fieldValue === null) return false

        const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue]
        const searchValue = String(filter.value).toLowerCase()

        if (filter.condition === 'startsWith') {
          return values.some((val) =>
            String(val).toLowerCase().startsWith(searchValue)
          )
        } else {
          return values.some((val) =>
            String(val).toLowerCase() === searchValue
          )
        }
      })
    })
  }, [filterWith])

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
      // cell: (props: any) => (
      //   cryosectionImageData.find(cryosection => cryosection.fields.ID === props.getValue()) ?
      //     <Link to={`/microsample-compositions/${props.getValue()}`} className='link'>{props.getValue()}</Link>
      //     :
      //     <>{props.getValue()}</>
      // )
      cell: (props: any) => (
        <Link
          to={`/cryosections/${encodeURIComponent(props.row.original.fields.ID)}`}
          className='link'
        >
          {props.getValue()}
        </Link>
      )
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
    },
    {
      id: 'Position',
      header: 'Position',
      accessorFn: (row) => row.fields.Position,
      filterFn: 'equals',
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Position))),
      },
    },
    {
      id: 'Macrosample',
      header: 'Macrosample',
      accessorFn: (row) => row.fields.Macrosample,
    },
    {
      id: 'SlideDate',
      header: 'Slide Date',
      accessorFn: (row) => row.fields.SlideDate,
      enableColumnFilter: false,
    },
    {
      id: 'Microsample number',
      header: 'Microsample number',
      accessorFn: (row) => row.fields["Microsample number"],
      enableColumnFilter: false,
    },
  ], [filteredData])


  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      pageTitle={'Cryosection'}
      tableDescription={tableDescription}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default Cryosection

