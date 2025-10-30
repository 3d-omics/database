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
}

const Pagination: React.FC<PaginationProps> = ({ table }) => {

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
          </strong>
        </span>
      </div>
    </section>
  )
}

export default Pagination