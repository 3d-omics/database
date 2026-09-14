import Table from 'components/Table'
import { ColumnDef } from '@tanstack/react-table'
import ErrorBanner from 'components/ErrorBanner'
import PageHeader from 'components/PageHeader'

const TableView = <TData,>({ columns, data, pageTitle, fetchMetaboliteError, displayPageHeader = false, displayTableHeader, displayTableDescription, displayTableFilters, displayTableBody, tableDescription}: {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageTitle: string
  fetchMetaboliteError?: string | null
  // When the table is the whole page, its title and description open the page
  // on the shared page header rather than sitting above the table
  displayPageHeader?: boolean
  displayTableHeader?: boolean
  displayTableDescription?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  tableDescription?: string
}) => {

  return (
    <div className='min-h-[calc(100dvh-var(--navbar-height)-var(--footer-height))] relative'>
      {displayPageHeader &&
        <PageHeader
          title={pageTitle}
          breadcrumbs={[
            { label: 'Data Portal Home', link: '/' },
            { label: pageTitle },
          ]}
        >
          {tableDescription && <p>{tableDescription}</p>}
        </PageHeader>
      }

      <div className='page_padding'>
        {fetchMetaboliteError &&
          <ErrorBanner>Error fetching metabolite data, Please try again</ErrorBanner>
        }

        {data.length !== 0 &&
          <Table<TData>
            data={data}
            columns={columns}
            pageTitle={pageTitle}
            displayTableHeader={displayTableHeader}
            displayTableTitle={!displayPageHeader}
            displayTableDescription={displayPageHeader ? false : displayTableDescription}
            displayTableFilters={displayTableFilters}
            displayTableBody={displayTableBody}
            tableDescription={tableDescription}
          />
        }

        {data.length === 0 &&
          <div className='text-center text-gray-500 mt-32'>No <span className='lowercase'>{pageTitle}</span> data was found.</div>
        }
      </div>
    </div>
  )
}

export default TableView
