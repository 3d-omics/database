import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DownloadTSVButton from './index'
import { ColumnDef } from '@tanstack/react-table'

// Mock config
vi.mock('config/metaboliteOptions', () => ({
  getExperimentOptions: vi.fn(() => ({
    Treatment: {
      T1: 'Treatment 1 Description',
      T2: 'Treatment 2 Description',
    },
  })),
}))

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

  const renderComponent = (props: any, experimentName = 'G - Test') => {
    return render(
      <MemoryRouter
        initialEntries={[`/test/${experimentName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route
            path='/test/:experimentName'
            element={<DownloadTSVButton {...props} />}
          />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders button with label', () => {
    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'Test',
      buttonLabel: 'Download TSV',
    })

    expect(screen.getByText('Download TSV')).toBeInTheDocument()
  })

  it('renders download icon', () => {
    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'Test',
      buttonLabel: 'Download',
    })

    expect(screen.getByTestId('download-tsv-icon')).toBeInTheDocument()
  })

  it('triggers download on button click', async () => {
    const user = userEvent.setup()

    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'TestFile',
      buttonLabel: 'Download',
    })

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

    renderComponent({
      filteredAndSortedData: dataWithoutFields,
      columns: mockColumns,
      fileTitle: 'Test',
      buttonLabel: 'Download',
    })

    const button = screen.getByText('Download')
    await user.click(button)

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('excludes checkbox column from TSV export', () => {
    const mockColumns = [
      {
        id: 'Metabolite',
        header: () => <div>Checkbox</div>,
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

    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'test',
      buttonLabel: 'Download',
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const blob = (global.Blob as any).mock.calls[0][0][0]

    expect(blob).not.toContain('Metabolite')
    expect(blob).not.toContain('[object Object]')
    expect(blob).toContain('ID')
    expect(blob).toContain('Name')
    expect(blob).toContain('M001')
    expect(blob).toContain('Sample 1')
  })

  it('excludes MAGCatalogue column from TSV export', () => {
    const mockColumns = [
      {
        id: 'MAGCatalogue',
        header: 'MAG Catalogue',
        accessorFn: (row: any) => row.mag,
      },
      {
        id: 'ID',
        header: 'ID',
        accessorFn: (row: any) => row.ID,
      },
    ]

    const mockData = [
      {
        id: '1',
        original: { ID: 'M001', mag: 'View Catalogue' },
        renderValue: vi.fn(),
      },
    ]

    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'test',
      buttonLabel: 'Download',
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const blob = (global.Blob as any).mock.calls[0][0][0]

    expect(blob).not.toContain('MAGCatalogue')
    expect(blob).not.toContain('View Catalogue')
    expect(blob).toContain('ID')
    expect(blob).toContain('M001')
  })

  it('transforms treatment values using experiment options', () => {
    const mockColumns = [
      {
        id: 'Treatment',
        header: 'Treatment',
        accessorFn: (row: any) => row.Treatment,
      },
      {
        id: 'ID',
        header: 'ID',
        accessorFn: (row: any) => row.ID,
      },
    ]

    const mockData = [
      {
        original: { fields: { Treatment: 'T1', ID: 'M001' } },
        renderValue: vi.fn(),
      },
    ]

    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'test',
      buttonLabel: 'Download',
    }, 'G - Test Experiment')

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const blob = (global.Blob as any).mock.calls[0][0][0]

    // Should contain transformed value, not the code
    expect(blob).toContain('Treatment 1 Description')
    expect(blob).not.toContain('T1')
  })

  it('keeps original value when no transformation exists', () => {
    const mockColumns = [
      {
        id: 'Treatment',
        header: 'Treatment',
        accessorFn: (row: any) => row.Treatment,
      },
    ]

    const mockData = [
      {
        original: { fields: { Treatment: 'T99' } }, // Not in options
        renderValue: vi.fn(),
      },
    ]

    renderComponent({
      filteredAndSortedData: mockData,
      columns: mockColumns,
      fileTitle: 'test',
      buttonLabel: 'Download',
    })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const blob = (global.Blob as any).mock.calls[0][0][0]

    // Should keep original value when no mapping exists
    expect(blob).toContain('T99')
  })
})