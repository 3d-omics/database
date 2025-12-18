import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Pagination from './index'

describe('Pagination', () => {
  let mockTable: any

  beforeEach(() => {
    mockTable = {
      firstPage: vi.fn(),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
      lastPage: vi.fn(),
      getCanPreviousPage: vi.fn().mockReturnValue(true),
      getCanNextPage: vi.fn().mockReturnValue(true),
      getState: vi.fn().mockReturnValue({
        pagination: { pageIndex: 2, pageSize: 10 },
      }),
      getPageCount: vi.fn().mockReturnValue(5),
      setPageIndex: vi.fn(),
      setPageSize: vi.fn(),
    }

    // Mock window.scrollTo
    window.scrollTo = vi.fn()

    // eslint-disable-next-line testing-library/no-node-access
    document.getElementById = vi.fn().mockReturnValue({
      getBoundingClientRect: () => ({ top: 100 }),
      scrollIntoView: vi.fn(),
    })
  })

  it('renders pagination buttons', () => {
    render(<Pagination table={mockTable} />)

    expect(screen.getByText('<<')).toBeInTheDocument()
    expect(screen.getByText('<')).toBeInTheDocument()
    expect(screen.getByText('>')).toBeInTheDocument()
    expect(screen.getByText('>>')).toBeInTheDocument()
  })

  it('displays current page and total pages', () => {
    render(<Pagination table={mockTable} />)

    expect(screen.getByText('Page')).toBeInTheDocument()
    expect(screen.getByText('3 of 5')).toBeInTheDocument()
  })

  it('calls firstPage when first button clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination table={mockTable} />)

    await user.click(screen.getByText('<<'))

    expect(mockTable.firstPage).toHaveBeenCalled()
  })

  it('calls previousPage when previous button clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination table={mockTable} />)

    await user.click(screen.getByText('<'))

    expect(mockTable.previousPage).toHaveBeenCalled()
  })

  it('calls nextPage when next button clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination table={mockTable} />)

    await user.click(screen.getByText('>'))

    expect(mockTable.nextPage).toHaveBeenCalled()
  })

  it('calls lastPage when last button clicked', async () => {
    const user = userEvent.setup()
    render(<Pagination table={mockTable} />)

    await user.click(screen.getByText('>>'))

    expect(mockTable.lastPage).toHaveBeenCalled()
  })

  it('disables previous buttons when cannot go previous', () => {
    mockTable.getCanPreviousPage.mockReturnValue(false)

    render(<Pagination table={mockTable} />)

    expect(screen.getByText('<<')).toBeDisabled()
    expect(screen.getByText('<')).toBeDisabled()
  })

  it('disables next buttons when cannot go next', () => {
    mockTable.getCanNextPage.mockReturnValue(false)

    render(<Pagination table={mockTable} />)

    expect(screen.getByText('>')).toBeDisabled()
    expect(screen.getByText('>>')).toBeDisabled()
  })

  it('scrolls to table top on navigation', async () => {
    const user = userEvent.setup()
    render(<Pagination table={mockTable} />)

    await user.click(screen.getByText('>'))

    expect(window.scrollTo).toHaveBeenCalled()
  })
})