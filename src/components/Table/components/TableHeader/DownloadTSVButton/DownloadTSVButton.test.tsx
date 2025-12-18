import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import DownloadTSVButton from './index'
import { ColumnDef } from '@tanstack/react-table'
import { fireEvent } from '@testing-library/react'

describe('DownloadTSVButton', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { })

    // Mock link click
    HTMLAnchorElement.prototype.click = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockColumns: ColumnDef<any>[] = [
    { id: 'id', header: 'ID' },
    { id: 'name', header: 'Name' },
  ]

  const mockData = [
    {
      original: { fields: { id: '1', name: 'Item 1' } },
      renderValue: vi.fn(),
    },
    {
      original: { fields: { id: '2', name: 'Item 2' } },
      renderValue: vi.fn(),
    },
  ]

  it('renders button with label', () => {
    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns}
        fileTitle='Test'
        buttonLabel='Download TSV'
      />
    )

    expect(screen.getByText('Download TSV')).toBeInTheDocument()
  })

  it('renders download icon', () => {
    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns}
        fileTitle='Test'
        buttonLabel='Download'
      />
    )

    expect(screen.getByTestId('download-tsv-icon')).toBeInTheDocument()
  })

  it('triggers download on button click', async () => {
    const user = userEvent.setup()

    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns}
        fileTitle='TestFile'
        buttonLabel='Download'
      />
    )

    const button = screen.getByText('Download')
    await user.click(button)

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
  })

  it('handles data without fields property', async () => {
    const user = userEvent.setup()

    const dataWithoutFields = [
      { original: { id: '1', name: 'Item 1' }, renderValue: vi.fn() },
    ]

    render(
      <DownloadTSVButton
        filteredAndSortedData={dataWithoutFields as any}
        columns={mockColumns}
        fileTitle='Test'
        buttonLabel='Download'
      />
    )

    const button = screen.getByText('Download')
    await user.click(button)

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('excludes checkbox column from TSV export', () => {
    const mockColumns = [
      {
        id: 'Metabolite',
        header: () => <div>Checkbox</div>, // Function header
        accessorFn: (row: any) => row.metabolite,
      },
      {
        id: 'ID',
        header: 'ID',
        accessorFn: (row: any) => row.ID,
      },
      {
        id: 'Name',
        header: 'Name',
        accessorFn: (row: any) => row.Name,
      },
    ]

    const mockData = [
      {
        id: '1',
        original: { ID: 'M001', Name: 'Sample 1', metabolite: 'Yes' },
        renderValue: vi.fn(),
      },
    ]

    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns as any}
        fileTitle='test'
        buttonLabel='Download'
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const blob = (global.Blob as any).mock.calls[0][0][0]

    // Should NOT include 'Metabolite' or its function header
    expect(blob).not.toContain('Metabolite')
    expect(blob).not.toContain('[object Object]') // Function would stringify weirdly

    // Should include normal columns
    expect(blob).toContain('ID')
    expect(blob).toContain('Name')
    expect(blob).toContain('M001')
    expect(blob).toContain('Sample 1')
  })
})