import { render, screen, within, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Table from '.'
import { ColumnDef } from '@tanstack/react-table'
import { formatIdForDisplay } from './components/TableFilters/utils/filterUtils'
import { fireEvent } from '@testing-library/react'
import { access } from 'fs'


const createMockColumn = (
  id: string,
  header: string,
  opts: {
    enableSorting?: boolean,
    enableColumnFilter?: boolean,
    sorted?: 'asc' | 'desc' | undefined,
    accessorFn?: (...args: any[]) => any,
    meta?: any
  } = {}
) => ({
  id,
  header,
  enableSorting: opts.enableSorting !== false,
  enableColumnFilter: opts.enableColumnFilter !== false,
  column: {
    getCanSort: () => opts.enableSorting !== false,
    getToggleSortingHandler: () => () => { },
    getNextSortingOrder: () => 'asc',
    getIsSorted: () => opts.sorted || undefined,
    getCanFilter: () => opts.enableColumnFilter !== false,
  },
  meta: opts.meta || undefined,
  isPlaceholder: false,
  getContext: () => ({}),
  accessorFn: (row: any) => row.fields[id],
})


const dataProp = [
  {
    "id": "recpcVvH6spIFLv90",
    "createdTime": "2021-10-11T12:33:14.000Z",
    "fields": {
      "ID": "A",
      "Name": "Preliminary sampling trial",
      "StartDate": "2021-10-14",
      "EndDate": "2021-10-14",
      "Type": "In vivo",
    }
  },
  {
    "id": "recsoYHoLp0oSNREi",
    "createdTime": "2021-10-11T12:33:14.000Z",
    "fields": {
      "ID": "B",
      "Name": "B - Proof-of-principle chicken trial A",
      "StartDate": "2021-11-08",
      "EndDate": "2021-12-21",
      "Type": "In vivo",
    }
  },
  {
    "id": "recrXmjSpb7u9rWhG",
    "createdTime": "2021-10-11T12:33:14.000Z",
    "fields": {
      "ID": "C",
      "Name": "C - Proof-of-principle swine trial",
      "StartDate": "2022-02-23",
      "EndDate": "2022-05-02",
      "Type": "In vivo",
    }
  },
  {
    "id": "recybWFYJEIGl5KT1",
    "createdTime": "2022-05-16T12:26:11.000Z",
    "fields": {
      "ID": "D",
      "Name": "D - Proof-of-principle chicken trial B",
      "StartDate": "2022-08-30",
      "EndDate": "2022-10-04",
      "Type": "In vivo",
    }
  },
  {
    "id": "recnKzzykzbbq8QOP",
    "createdTime": "2022-11-07T11:53:04.000Z",
    "fields": {
      "ID": "F",
      "Name": "F - Adenovirus experiment (poultry)",
      "StartDate": "2025-05-09",
      "Type": "In vivo",
    }
  },
  {
    "id": "rechxoMWVAvR1SVzU",
    "createdTime": "2022-12-05T13:51:11.000Z",
    "fields": {
      "ID": "G",
      "Name": "G - Salmonella experiment (poultry)",
      "StartDate": "2023-06-05",
      "EndDate": "2023-07-10",
      "Type": "In vivo",
    }
  },
  {
    "id": "recVv7OSgIVrb0uuQ",
    "createdTime": "2022-12-05T13:51:12.000Z",
    "fields": {
      "ID": "H",
      "Name": "H - Histomonas experiment (Chicken)",
      "StartDate": "2024-08-01",
      "EndDate": "2024-10-17",
      "Type": "In vivo",
    }
  },
  {
    "id": "rechUt4qYvCw707vb",
    "createdTime": "2022-12-05T13:51:13.000Z",
    "fields": {
      "ID": "I",
      "Name": "I - Protein efficiency experiment (swine) trial A",
      "StartDate": "2023-05-09",
      "EndDate": "2023-08-08",
      "Type": "In vivo",
    }
  },
  {
    "id": "recuoYKZJA49ldZrI",
    "createdTime": "2022-12-05T13:51:14.000Z",
    "fields": {
      "ID": "J",
      "Name": "J - Mannan fibre experimen (swine)",
      "StartDate": "2023-01-10",
      "EndDate": "2023-03-16",
      "Type": "In vivo",
    }
  },
  {
    "id": "rec2gEj1qrghG2orD",
    "createdTime": "2023-04-21T12:03:12.000Z",
    "fields": {
      "ID": "K",
      "Name": "K - Protein efficiency experiment (swine) trial B",
      "StartDate": "2023-08-24",
      "EndDate": "2023-10-26",
      "Type": "In vivo",
    }
  },
  {
    "id": "recz8SZ8BXaNQAzdR",
    "createdTime": "2024-01-26T12:35:47.000Z",
    "fields": {
      "ID": "M",
      "Name": "M - Histomonas experiment (Turkey)",
      "StartDate": "2024-05-01",
      "EndDate": "2024-07-24",
      "Type": "In vivo",
    }
  }
]


const columnsProp: ColumnDef<any>[] = [
  createMockColumn('ID', 'ID', { sorted: undefined }),
  createMockColumn('Name', 'Name'),
  createMockColumn('Type', 'Type', { enableSorting: false, meta: { filterVariant: 'select', uniqueValues: ['In vivo', 'In vitro'] } }),
  createMockColumn('StartDate', 'Start Date', { enableColumnFilter: false }),
  createMockColumn('EndDate', 'End Date', { enableColumnFilter: false }),
  // createMockColumn('Metabolite', 'Metabolite Data'),
];


const pageTitle = 'Animal Trial Experiment'

const renderTableWithData = () => {
  render(
    <Table
      data={dataProp}
      columns={columnsProp}
      loading={false}
      pageTitle={pageTitle}
    />
  )
}



describe('components > Table', () => {

  it('should render table with provided data, columns, and page title when valid props are passed', () => {
    renderTableWithData()
    expect(screen.getByText('Animal Trial Experiment')).toBeInTheDocument()
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByText(/ID/i)).toBeInTheDocument()
    expect(screen.getByText(/Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Type/i)).toBeInTheDocument()
    expect(screen.getByText(/Start Date/i)).toBeInTheDocument()
    expect(screen.getByText(/End Date/i)).toBeInTheDocument()
  })


  it('should display correct number of filtered records in header section when data is provided', () => {
    renderTableWithData()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText(/records/i)).toBeInTheDocument()
  })



  it('should render table headers with sorting icons when columns are sortable', () => {
    renderTableWithData()
    const sortIcon = within(screen.getByText('ID')).getByTestId('sort-icon-for-ID')
    expect(sortIcon).toBeInTheDocument()
    const sortIcon2 = within(screen.getByText('Name')).getByTestId('sort-icon-for-Name')
    expect(sortIcon2).toBeInTheDocument()
    expect(screen.queryByTestId('sort-icon-for-Type')).not.toBeInTheDocument()
    const sortIcon3 = within(screen.getByText('Start Date')).getByTestId('sort-icon-for-StartDate')
    expect(sortIcon3).toBeInTheDocument()
    const sortIcon4 = within(screen.getByText('End Date')).getByTestId('sort-icon-for-EndDate')
    expect(sortIcon4).toBeInTheDocument()
  })



  it('should render table body with data rows and cells when data is provided', () => {
    renderTableWithData()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Preliminary sampling trial')).toBeInTheDocument()
    expect(screen.getAllByText('2021-10-14')).toHaveLength(2)
  })



  it('should render MetaboliteColumn component for cells with column id Metabolite', () => {
    render(
      <Table
        data={[{ "fields": { Metabolite: "Yes" } }]}
        columns={[
          ...columnsProp,
          createMockColumn('Metabolite', 'Metabolite')
        ]}
        loading={false}
        pageTitle={pageTitle}
      />
    )
    expect(screen.getByTestId('metabolite-checkbox')).toBeInTheDocument()
  })



  it('should show pagination component when filtered data exists', () => {
    renderTableWithData()
    expect(screen.getByText(/page/i)).toBeInTheDocument()
    expect(screen.getByText(/1 of 1/i)).toBeInTheDocument()
  })





  // Shows "No results match for this search criteria" message when filteredData is empty
  it('should show no results message and no pagination when filteredData is empty', () => {
    render(
      <Table
        data={[]}
        columns={columnsProp}
        loading={false}
        pageTitle={pageTitle}
      />
    )
    expect(screen.getByText(/no results match for this search criteria/i)).toBeInTheDocument()
    expect(screen.queryByText(/page/i)).not.toBeInTheDocument()
  })




  it('should handle empty data array gracefully without crashing', () => {
    expect(() => {
      render(
        <Table
          data={[]}
          columns={columnsProp}
          loading={false}
          pageTitle={pageTitle}
        />
      )
    }).not.toThrow()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText(/records/i)).toBeInTheDocument()
  })




  it('should manage undefined or null values in cell rendering without breaking', () => {
    expect(() => {
      render(
        <Table
          data={[{
            "fields": {
              "ID": undefined,
              "Name": "Preliminary sampling trial",
              "StartDate": null,
              "EndDate": null,
              "Type": undefined,
            }
          }]}
          columns={columnsProp}
          loading={false}
          pageTitle={pageTitle}
        />
      )
    }).not.toThrow()
    expect(screen.getByText('Preliminary sampling trial')).toBeInTheDocument()
    expect(screen.getByText('Start Date')).toBeInTheDocument()
  })




  it('should manage pagination state correctly when data changes', () => {
    const initialData = Array.from({ length: 250 }, (_, i) => ({ fields: { ID: i + 1, Name: `Item ${i + 1}`, Type: null, StartDate: null, EndDate: null } }))
    render(<Table data={initialData} columns={columnsProp} loading={false} pageTitle={pageTitle} />)
    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText(/records/i)).toBeInTheDocument()
    expect(screen.getByText(/page/i)).toBeInTheDocument()
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument()
  })



  it('should display "Download as TSV" button', () => {
    renderTableWithData()
    expect(screen.getByTestId('download-all-tsv-button-wrapper')).toBeInTheDocument()
  })




  // it('only shows the "Download Selected (n) as TSV" button when at least one item is selected', () => {
  //   renderTableWithData()
  //   const checkbox = screen.getAllByRole('checkbox')[0]
  //   // "Download Selected (n) as TSV" button should not be there initially
  //   expect(screen.queryByTestId('download-selected-tsv-button-wrapper')).not.toBeInTheDocument()
  //   // Click the checkbox to select the row
  //   fireEvent.click(checkbox)
  //   // "Download Selected (n) as TSV" button should now appear
  //   expect(screen.getByTestId('download-selected-tsv-button-wrapper')).toBeInTheDocument()
  //   fireEvent.click(checkbox)
  //   // Now it should disappear again
  //   expect(screen.queryByTestId('download-selected-tsv-button-wrapper')).not.toBeInTheDocument()
  // })




  // it('shows the correct count in the download button label', () => {
  //   renderTableWithData()
  //   const checkboxes = screen.getAllByRole('checkbox')
  //   fireEvent.click(checkboxes[0])
  //   fireEvent.click(checkboxes[1])
  //   fireEvent.click(checkboxes[2])
  //   expect(screen.getByText(/Download Selected \(3\) as TSV/i)).toBeInTheDocument()
  // })




  it('should render Filter components for filterable columns', () => {
    renderTableWithData()
    expect(screen.getAllByPlaceholderText('Search...')).toHaveLength(2)
  })




  it('formatIdForDisplay should return correct display format for given id', () => {
    expect(formatIdForDisplay('ID')).toBe('ID')
    expect(formatIdForDisplay('LMBatch_flat')).toBe('LMBatch')
    expect(formatIdForDisplay('Individual')).toBe('Experimental Unit Series')
    expect(formatIdForDisplay('Metabolite')).toBe('Metabolite Data')
    expect(formatIdForDisplay('Some_flat')).toBe('Some')
    expect(formatIdForDisplay('CamelCaseId')).toBe('Camel Case Id')
  })





  it('should update table state when a filter is removed', async () => {
    renderTableWithData()
    // Simulate applying a filter
    const searchInputs = screen.getAllByPlaceholderText('Search...')
    fireEvent.change(searchInputs[1], { target: { value: 'swine' } })
    expect(await screen.findByText('4')).toBeInTheDocument() // there should be 4 records matching "swine" in Name column
    await waitFor(() => {
      expect(screen.getByText('C - Proof-of-principle swine trial')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText('B - Proof-of-principle chicken trial A')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText('F - Adenovirus experiment (poultry)')).not.toBeInTheDocument()
    })
    // Simulate removing the filter
    const removeFilterButton = screen.getByTestId('remove-filter-icon-for-Name')
    fireEvent.click(removeFilterButton)
    // Check if the filter is removed from the state
    expect(await screen.findByText('11')).toBeInTheDocument()
    expect(await screen.findByText('B - Proof-of-principle chicken trial A')).toBeInTheDocument()
    expect(await screen.findByText('F - Adenovirus experiment (poultry)')).toBeInTheDocument()
  })




  it('should clear all sorting when X icon is clicked', async () => {
    renderTableWithData()
    // Check initial sorting state
    const rows = screen.getAllByRole('row') // This includes header row(s) too
    expect(within(rows[5]).getByText('F - Adenovirus experiment (poultry)')).toBeInTheDocument()
    // Simulate sorting
    const sortIcon = within(screen.getByText('Start Date')).getByTestId('sort-icon-for-StartDate')
    expect(sortIcon).toBeInTheDocument()
    fireEvent.click(sortIcon)
    await waitFor(() => {
      const updatedRows = screen.getAllByRole('row')
      expect(within(updatedRows[5]).getByText('J - Mannan fibre experimen (swine)')).toBeInTheDocument()
    })
    // Simulate removing sorting
    const removeSortButton = screen.getByTestId('remove-sort-icon-for-StartDate')
    fireEvent.click(removeSortButton)
    // Check if sorting is cleared
    await waitFor(() => {
      const updatedRows = screen.getAllByRole('row')
      expect(within(updatedRows[5]).getByText('F - Adenovirus experiment (poultry)')).toBeInTheDocument()
    })
  })


  it('should display CompareSamplesButton only when metabolite IDs are selected', () => {
    const data = [{ "fields": { "ID": "A", "Metabolite": "Yes" } },
    { "fields": { "ID": "B", "Metabolite": "No" } }]
    const columns = [createMockColumn('Metabolite', 'Metabolite Data', { enableSorting: false })]
    render(<Table data={data} columns={columns} loading={false} pageTitle="Test Table" />)

    // Initially, CompareSamplesButton should not be in the document
    expect(screen.queryByTestId('compare-metabolite-samples-button')).not.toBeInTheDocument()

    // Simulate selecting a metabolite ID
    fireEvent.click(screen.getByTestId('metabolite-checkbox'))

    // Check if the CompareSamplesButton appears
    expect(screen.getByTestId('compare-metabolite-samples-button')).toBeInTheDocument()
  })


})
