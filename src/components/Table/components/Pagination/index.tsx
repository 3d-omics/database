import React from 'react'

type PaginationProps = {
  table: {
    firstPage: () => void
    previousPage: () => void
    nextPage: () => void
    lastPage: () => void
    getCanPreviousPage: () => boolean
    getCanNextPage: () => boolean
    getState: () => {
      pagination: {
        pageIndex: number
        pageSize: number
      }
    }
    getPageCount: () => number
    setPageIndex: (pageIndex: number) => void
    setPageSize: (pageIndex: number) => void
  }
  loading: boolean
}

const Pagination: React.FC<PaginationProps> = ({ table, loading }) => {

  const scrollToTableTop = () => {
    const element = document.getElementById('table-top');
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y });
      // window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }
    if (element) {
      (element as HTMLElement).scrollIntoView({ block: 'start' });
      // (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-8 flex justify-center absolute bottom-0 left-0 right-0">
      <div className="flex items-center gap-2">
        <button
          className="pagination_btn"
          onClick={() => {
            table.firstPage()
            scrollToTableTop()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="pagination_btn"
          onClick={() => {
            table.previousPage()
            scrollToTableTop()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="pagination_btn"
          onClick={() => {
            table.nextPage()
            scrollToTableTop()
          }}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="pagination_btn"
          onClick={() => {
            table.lastPage()
            scrollToTableTop()
          }}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {loading
              ? <span className="loading loading-dots loading-xs ml-1" data-testid="loading-dots"></span>
              : table.getPageCount().toLocaleString()
            }
          </strong>
        </span>


        {/* <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span> */}

        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
          className='border p-1.5 rounded'
        >
          {[10, 20, 30, 40, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize} pages
            </option>
          ))}
        </select> */}

      </div>
    </section>
  )
}

export default Pagination