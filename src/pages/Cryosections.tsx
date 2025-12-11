import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table';
import TableView from 'components/TableView';
import cryosectionData from 'assets/data/airtable/cryosection.json'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'
import { Link } from 'react-router-dom'
import CompositionExistsIcon from 'assets/images/GC.png'

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

  const tableDescription = "Cryosections are thin intestinal cross-cuts containing intestinal tissue of the animal hosts as well as intestinal contents collected from intestinal segments using a cryostat. In 3D’omics cryosections were employed for generating luminal and host metabolomic data, as well as producing microsamples for micro-scale spatial metagenomics using laser capture microdissection."

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
      cell: (props: any) => (
        <div className='flex items-center gap-1 min-w-[120px]'>
          <Link
            to={`/cryosections/${encodeURIComponent(props.row.original.fields.ID)}`}
            className='link'
          >
            {props.getValue()}
          </Link>
          {cryosectionImageData.find(cryosection => cryosection.fields.ID === props.getValue()) &&
            <div className='tooltip tooltip-right before:text-xs' data-tip='Microsample community composition info available'>
              <img
              src={CompositionExistsIcon}
              alt=''
              className='w-6 h-6 object-contain'
              />
            </div>
          }
        </div>
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
      cell: (props: any) => (
        <Link
          to={`/macrosamples/${encodeURIComponent(props.row.original.fields.Macrosample)}`}
          className='link'
        >
          {props.getValue()}
        </Link>
      )
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
      pageTitle={'Cryosections'}
      tableDescription={tableDescription}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default Cryosection

