import TableBody from 'components/Table/components/TableBody'
import { useReactTable, getCoreRowModel, CellContext } from '@tanstack/react-table'
import ErrorBanner from 'components/ErrorBanner'
import { Link } from 'react-router-dom'
import { useTaxonomyData } from 'hooks/useTaxonomyData'


type SampleData = Array<{ [key: string]: string }>

interface MicrosampleTabProps {
  data: SampleData | null
  genomeName: string
  isLoading: boolean
  error: string | null
}

const MicrosampleTab = ({ data, genomeName, isLoading, error }: MicrosampleTabProps) => {
  const columns = [
    {
      id: 'id',
      header: 'Microsample ID',
      accessorKey: 'id',
    },
    {
      id: 'count',
      header: 'Count',
      accessorKey: 'count',
    },
    {
      id: 'run_accession',
      header: 'ENA link',
      accessorKey: 'run_accession',
      cell: ({ cell, row }: CellContext<{ [key: string]: string }, string>) => (
        <Link
          to={row.original.enaLink}
          target="_blank"
          rel="noopener noreferrer"
          className='link'
        >
          {cell.getValue()}
        </Link>
      )
    },
    // {
    //   id: 'cryosection_text',
    //   header: 'Cryosection Text',
    //   accessorKey: 'cryosection_text',
    // }
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <div className='loading loading-dots' />
  }

  if (error) {
    return <ErrorBanner>{error}</ErrorBanner>
  }

  if (!data || data.length === 0) {
    return <p>No microsamples containing <b>{genomeName}</b> were found.</p>
  }

  return (
    <div>
      <p className='mb-4 text-lg'>
        <b>{data.length}</b> {data.length === 1 ? 'microsample' : 'microsamples'} containing <b>{genomeName}</b>
      </p>
      <TableBody
        table={table}
        checkedItems={[]}
        setCheckedItems={() => { }}
        checkedMetaboliteIds={[]}
        setCheckedMetaboliteIds={() => { }}
        displayTableFilters={false}
      />
    </div>
  )
}

export default MicrosampleTab