import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Pagination from '.'


const renderPagination = (pageIndex: number) => {
  const mockTable = {
    firstPage: vi.fn(),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    lastPage: vi.fn(),
    getCanPreviousPage: vi.fn().mockReturnValue(true),
    getCanNextPage: vi.fn().mockReturnValue(true),
    getState: vi.fn().mockReturnValue({
      pagination: { pageIndex: pageIndex, pageSize: 10 }
    }),
    getPageCount: vi.fn().mockReturnValue(5), // number of total pages 
    setPageIndex: vi.fn(),
    setPageSize: vi.fn()
  }
  render(<Pagination table={mockTable} loading={false} />)
  return { mockTable }
}




describe('components > Table > Pagination', () => {

  it('should render all navigation buttons when component mounts', () => {
    renderPagination(0)
    expect(screen.getByRole('button', { name: '<<' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '<' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '>>' })).toBeInTheDocument()
  })


  it('should display correct current page number and total pages number when not loading', () => {
    renderPagination(2)
    expect(screen.getByText(/3\s+of\s+5/)).toBeInTheDocument()
  })


  it('should call firstPage and go to top when clicking "<<"', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => { })
    vi.spyOn(document, 'getElementById').mockImplementation(() => ({
      getBoundingClientRect: () => ({ top: 0 }),
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement))
    const { mockTable } = renderPagination(2)
    fireEvent.click(screen.getByRole('button', { name: '<<' }))
    expect(mockTable.firstPage).toHaveBeenCalledOnce()
    expect(window.scrollTo).toHaveBeenCalled()
  })



  it('should disable previous page button when cannot go to previous page', () => {
    const mockTable = {
      firstPage: vi.fn(),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
      lastPage: vi.fn(),
      getCanPreviousPage: vi.fn().mockReturnValue(false),
      getCanNextPage: vi.fn().mockReturnValue(true),
      getState: vi.fn().mockReturnValue({
        pagination: { pageIndex: 0, pageSize: 10 }
      }),
      getPageCount: vi.fn().mockReturnValue(10),
      setPageIndex: vi.fn(),
      setPageSize: vi.fn()
    }
    render(<Pagination table={mockTable} loading={false} />)
    expect(screen.getByRole('button', { name: '<' })).toBeDisabled()
  })



  it('should disable next page button when cannot go to next page', () => {
    const mockTable = {
      firstPage: vi.fn(),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
      lastPage: vi.fn(),
      getCanPreviousPage: vi.fn().mockReturnValue(true),
      getCanNextPage: vi.fn().mockReturnValue(false),
      getState: vi.fn().mockReturnValue({
        pagination: { pageIndex: 9, pageSize: 10 }
      }),
      getPageCount: vi.fn().mockReturnValue(10),
      setPageIndex: vi.fn(),
      setPageSize: vi.fn()
    }
    render(<Pagination table={mockTable} loading={false} />)
    expect(screen.getByRole('button', { name: '>' })).toBeDisabled()
  })



})
