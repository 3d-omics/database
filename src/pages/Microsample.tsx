import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import TableView from 'components/TableView'
import microsampleData from 'assets/data/airtable/microsample.json'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'


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
    'ENA accession'?: string
    'ENA link'?: string
  }
}

const Microsample = ({ displayTableHeader, displayTableFilters, displayTableBody, filterWith = [] }: {
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  filterWith?: { id: keyof TData['fields']; value: string | number, condition?: string }[]
}) => {

  const data = microsampleData as unknown as TData[];
  // console.log(data)

  const filteredData = useMemo(() => {
    if (!filterWith || filterWith.length === 0) {
      return data;
    }

    return (data).filter((record) => {
      return filterWith.every((filter) => {
        const fieldValue = record.fields[filter.id];

        if (fieldValue === undefined || fieldValue === null) return false;

        const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        const searchValue = String(filter.value).toLowerCase();

        if (filter.condition === 'startsWith') {
          return values.some((val) =>
            String(val).toLowerCase().startsWith(searchValue)
          );
        } else {
          return values.some((val) =>
            String(val).toLowerCase() === searchValue
          );
        }
      });
    });
  }, [filterWith]);




  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'Code',
      header: 'Code',
      accessorFn: (row) => row.fields.Code,
    },
    {
      id: 'LMBatch_flat',
      header: 'Batch',
      accessorFn: (row) => row.fields.LMBatch_flat,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.LMBatch_flat))),
      },
    },
    {
      id: 'Cryosection_flat',
      header: 'Cryosection',
      accessorFn: (row) => row.fields.Cryosection_flat,
      // === for dropdown filter ===
      // meta: {
      //   filterVariant: 'select' as const,
      //   uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Cryosection_flat))),
      // },
      cell: (props: any) => (
        cryosectionImageData.find(cryosection => cryosection.fields.ID === props.getValue()) ?
          <Link to={`/microsample-composition/${props.getValue()}`} className='link'>{props.getValue()}</Link>
          :
          <>{props.getValue()}</>
      )
    },
    {
      id: 'CollectionMethod',
      header: 'Collection Method',
      accessorFn: (row) => row.fields.CollectionMethod?.[0],
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.CollectionMethod?.[0]))),
      },
    },
    {
      id: 'Date',
      header: 'Date',
      accessorFn: (row) => row.fields.Date,
      enableColumnFilter: false,
    },
    {
      id: 'Xcoord',
      header: 'Xcoord (µm)',
      accessorFn: (row) => row.fields.Xcoord,
      enableColumnFilter: false,
    },
    {
      id: 'Ycoord',
      header: 'Ycoord (µm)',
      accessorFn: (row) => row.fields.Ycoord,
      enableColumnFilter: false,
    },
    {
      id: 'Size',
      header: 'Size (µm²)',
      accessorFn: (row) => row.fields.Size,
      enableColumnFilter: false,
    },
    {
      id: 'ENA Accession',
      header: 'ENA Accession',
      accessorFn: (row) => row.fields['ENA accession'],
      cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
        const enaLink = row.original.fields['ENA link'];
        return enaLink ? (
          <Link to={enaLink} target="_blank" rel="noopener noreferrer" className='link'>
            {cell.getValue() as string}
          </Link>
        ) : (
          <></>
        );
      }
    },
  ], [filteredData])


  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      pageTitle={'Microsample'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default Microsample
