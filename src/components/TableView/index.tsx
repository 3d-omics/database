import Table from 'components/Table'
import { ColumnDef, type ColumnFiltersState } from '@tanstack/react-table'
import ErrorBanner from 'components/ErrorBanner'
import PageHeader from 'components/PageHeader'
import GlobalSearch from 'components/GlobalSearch'
import type { ReactNode } from 'react'

const TableView = <TData,>({ columns, data, pageTitle, fetchMetaboliteError, displayPageHeader = false, displayTableHeader, displayTableDescription, displayTableFilters, displayTableBody, tableDescription, initialColumnFilters = [], recordFilterControls }: {
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
  initialColumnFilters?: ColumnFiltersState
  recordFilterControls?: ReactNode
}) => {

  return (
    <div className='min-h-[calc(100dvh-var(--navbar-height)-var(--footer-height))] relative'>
      {displayPageHeader &&
        <PageHeader
          title={pageTitle}
          aside={<GlobalSearch />}
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

        {(data.length !== 0 || recordFilterControls) &&
          <Table<TData>
            key={JSON.stringify(initialColumnFilters)}
            data={data}
            columns={columns}
            pageTitle={pageTitle}
            displayTableHeader={displayTableHeader}
            displayTableTitle={!displayPageHeader}
            displayTableDescription={displayPageHeader ? false : displayTableDescription}
            displayTableFilters={displayTableFilters}
            displayTableBody={displayTableBody}
            tableDescription={tableDescription}
            initialColumnFilters={initialColumnFilters}
            recordFilterControls={recordFilterControls}
          />
        }

        {data.length === 0 && !recordFilterControls &&
          <div className='text-center text-ink_muted mt-32'>No <span className='lowercase'>{pageTitle}</span> data was found.</div>
        }
      </div>
    </div>
  )
}

export default TableView
