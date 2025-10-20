import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TableView from '.'
import type { ColumnDef } from '@tanstack/react-table'


const columnsProp: ColumnDef<any>[] = [
  {
    "id": "ID",
    "header": "ID"
  },
  {
    "id": "Name",
    "header": "Name"
  },
  {
    "id": "Type",
    "header": "Type",
    "enableSorting": false,
    "meta": {
      "filterVariant": "select",
      "uniqueValues": [
        "In vivo"
      ]
    }
  },
  {
    "id": "StartDate",
    "header": "Start Date",
    "enableColumnFilter": false
  },
  {
    "id": "EndDate",
    "header": "End Date",
    "enableColumnFilter": false
  }
]

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



describe('components > TableView', () => {

  it('shows Loading component when first100Loading is true', () => {
    render(
      <TableView
        first100Loading={true}
        allLoading={false}
        first100Error={null}
        allError={null}
        columns={columnsProp}
        data={[]}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.getByTestId('loading-dots')).toBeInTheDocument()
  })


  it('shows LoadingRemainingData when first100Loading is false and allLoading is true', () => {
    render(
      <TableView
        first100Loading={false}
        allLoading={true}
        first100Error={null}
        allError={null}
        columns={columnsProp}
        data={[]}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.getByText(/loading remaining data/i)).toBeInTheDocument()
  })



  it('shows ErrorBanner for first100Error', () => {
    render(
      <TableView
        first100Loading={false}
        allLoading={false}
        first100Error="Request failed with status code 404"
        allError={null}
        columns={columnsProp}
        data={[]}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.getByText(/error! something went wrong. please try again./i)).toBeInTheDocument()
    expect(screen.getByText(/request failed with status code 404/i)).toBeInTheDocument()
  })



  it('shows ErrorBanner for allError if first100Error is null', () => {
    render(
      <TableView
        first100Loading={false}
        allLoading={false}
        first100Error={null}
        allError="Request failed with status code 404"
        columns={columnsProp}
        data={[]}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.getByText(/error! something went wrong. please try again./i)).toBeInTheDocument()
    expect(screen.getByText(/request failed with status code 404/i)).toBeInTheDocument()
  })






  it('shows ErrorBanner when fetchMetaboliteError is present', () => {
    render(
      <TableView
        first100Loading={false}
        allLoading={false}
        first100Error={null}
        allError={null}
        fetchMetaboliteError="Something went wrong"
        columns={columnsProp}
        data={[]}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.getByText(/error! something went wrong. please try again./i)).toBeInTheDocument()
    expect(screen.getByText(/error fetching metabolite data/i)).toBeInTheDocument()
  })





  it('shows Table component when data is present', () => {
    render(
      <TableView
        first100Loading={false}
        allLoading={false}
        first100Error={null}
        allError={null}
        columns={columnsProp}
        data={dataProp}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.getByText(/animal trial Experiment/i)).toBeInTheDocument()
    expect(screen.getByTestId('table')).toBeInTheDocument()
  })





  it('does not show Table when data is empty', () => {
    render(
      <TableView
        first100Loading={false}
        allLoading={false}
        first100Error={null}
        allError={null}
        columns={columnsProp}
        data={[]}
        pageTitle="Animal Trial Experiment"
      />
    )
    expect(screen.queryByText(/animal trial Experiment/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('table')).not.toBeInTheDocument()
  })

})
