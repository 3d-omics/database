import Table from 'components/Table'
import { ColumnDef } from '@tanstack/react-table'
import ErrorBanner from 'components/ErrorBanner'

const TableView = <TData,>({ columns, data, pageTitle, fetchMetaboliteError, displayTableHeader, displayTableFilters, displayTableBody }: {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageTitle: string
  fetchMetaboliteError?: string | null
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
}) => {

  return (
    <div className='page_padding min-h-[calc(100dvh-var(--navbar-height)-var(--footer-height))] relative'>
      {fetchMetaboliteError && 
        <ErrorBanner>Error fetching metabolite data, Please try again</ErrorBanner>
      }
      
      {data.length !== 0 &&
        <Table<TData>
          data={data}
          columns={columns}
          pageTitle={pageTitle}
          displayTableHeader={displayTableHeader}
          displayTableFilters={displayTableFilters}
          displayTableBody={displayTableBody}
        />
      }

      {data.length === 0 && 
        <div className='text-center text-gray-500 mt-32'>No <span className='lowercase'>{pageTitle}</span> data was found.</div>
      }
    </div>
  )
}

export default TableView

