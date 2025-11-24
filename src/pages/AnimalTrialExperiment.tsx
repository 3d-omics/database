import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import { Link } from 'react-router-dom'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'

type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    Name: string
    Type: string
    StartDate?: string
    EndDate?: string
    'Bioproject accession'?: string
    'Bioproject link'?: string
  }
}

const AnimalTrialExperiment = () => {

  const data = animalTrialExperimentData as unknown as TData[]

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
    },
    {
      id: 'Name',
      header: 'Name',
      accessorFn: (row) => row.fields.Name,
      cell: (props: any) => (
        <Link
          to={`/animal-trial-experiment/${encodeURIComponent(props.row.original.fields.Name)}`}
          className='link'
        >
          {props.getValue()}
        </Link>
      )
    },
    {
      id: 'Type',
      header: 'Type',
      accessorFn: (row) => row.fields.Type,
      enableSorting: false,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Type)))
      },
    },
    {
      id: 'StartDate',
      header: 'Start Date',
      accessorFn: (row) => row.fields.StartDate,
      enableColumnFilter: false,
    },
    {
      id: 'EndDate',
      header: 'End Date',
      accessorFn: (row) => row.fields.EndDate,
      enableColumnFilter: false,
    },
    {
      id: 'Bioproject Accession',
      header: 'Bioproject Accession',
      accessorFn: (row) => row.fields['Bioproject accession'],
      cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
        const bioprojectLink = row.original.fields['Bioproject link'];
        return bioprojectLink ? (
          <Link to={bioprojectLink} target="_blank" rel="noopener noreferrer" className='link'>
            {cell.getValue() as string}
          </Link>
        ) : (
          <></>
        );
      }
    },
    {
      id: 'MAGCatalogue',
      header: 'MAG Catalogue',
      enableColumnFilter: false,
      enableSorting: false,
      cell: (props: any) => {
        return (
          <Link
            to={`/genome-catalogues/${encodeURIComponent(props.row.original.fields.Name)}`}
            className='link'
          >
            View MAG Catalogue
          </Link>
        )
      }
    },
  ], [data])


  return (
    <TableView<TData>
      data={data}
      columns={columns}
      pageTitle={'Animal Trial/Experiment'}
    />
  )
}

export default AnimalTrialExperiment
