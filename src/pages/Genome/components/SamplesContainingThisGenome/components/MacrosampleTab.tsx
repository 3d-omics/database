import TableBody from 'components/Table/components/TableBody'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import ErrorBanner from 'components/ErrorBanner'

type SampleData = Array<{ [key: string]: string }>

interface MacrosampleTabProps {
  data: SampleData
  genomeName: string
  isLoading: boolean
  error: string | null
}

const MacrosampleTab = ({ data, genomeName, isLoading, error }: MacrosampleTabProps) => {
  const columns = [
    {
      id: 'id',
      header: 'Macrosample ID',
      accessorKey: 'id',
    },
    {
      id: 'count',
      header: 'Count',
      accessorKey: 'count',
    }
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <div className='loading loading-dots' />
  }

  if (error) {
    return <ErrorBanner>{error}</ErrorBanner>
  }

  if (data.length === 0) {
    return <p>No macrosamples containing <b>{genomeName}</b> were found.</p>
  }

  return (
    <div>
      <p className='mb-4 text-lg'>
        <b>{data.length}</b> {data.length === 1 ? 'macrosample' : 'macrosamples'} containing <b>{genomeName}</b>
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

export default MacrosampleTab