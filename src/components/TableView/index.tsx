import Loading from 'components/Loading'
import LoadingRemainingData from 'components/LoadingRemainingData'
import Table from 'components/Table'
import { ColumnDef } from '@tanstack/react-table'
import ErrorBanner from 'components/ErrorBanner'

const TableView = <TData,>({ first100Loading, allLoading, first100Error, allError, columns, data, pageTitle, fetchMetaboliteError, displayTableHeader, displayTableFilters, displayTableBody }: {
  first100Loading: boolean
  allLoading: boolean
  first100Error: string | null
  allError: string | null
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
      {first100Loading && <div className='h-[calc(100dvh-var(--navbar-height))]'><Loading /></div>}
      {!first100Loading && allLoading && <LoadingRemainingData />}
      {first100Error
        ? <ErrorBanner>{first100Error}</ErrorBanner>
        : allError
        && <ErrorBanner>{allError}</ErrorBanner>
      }
      {fetchMetaboliteError &&
        <ErrorBanner>Error fetching metabolite data, Please try again</ErrorBanner>
      }
      
      {/* {data && !first100Loading && !allLoading && !first100Error && !allError &&
        <Table<TData>
          data={data}
          columns={columns}
          loading={allLoading}
          pageTitle={pageTitle}
          displayTableHeader={displayTableHeader}
          displayTableFilters={displayTableFilters}
          displayTableBody={displayTableBody}
        />
      } */}

      {data.length !== 0 &&
        <Table<TData>
          data={data}
          columns={columns}
          loading={allLoading}
          pageTitle={pageTitle}
          displayTableHeader={displayTableHeader}
          displayTableFilters={displayTableFilters}
          displayTableBody={displayTableBody}
        />
      }
      {data.length === 0 && !first100Loading && !allLoading && !first100Error && !allError && (
        <div className='text-center text-gray-500 mt-32'>
          No data was found.
        </div>
      )}
    </div>
  )
}

export default TableView