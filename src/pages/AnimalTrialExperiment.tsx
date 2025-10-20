import { useMemo } from 'react'
import { ColumnDef, CellContext } from '@tanstack/react-table'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import TableView from 'components/TableView'
import { Link } from 'react-router-dom'
import { airtableConfig } from 'config/airtable'

type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    Name: string
    Type: string
    StartDate?: string
    EndDate?: string
  }
}

const AnimalTrialExperiment = () => {

  const { animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId } = airtableConfig

  const { first100Data, first100Loading, first100Error, allData, allLoading, allError, } = useGetFirst100Data({
    AIRTABLE_BASE_ID: animalTrialExperimentBaseId,
    AIRTABLE_TABLE_ID: animalTrialExperimentTableId,
    AIRTABLE_VIEW_ID: animalTrialExperimentViewId,
  })

  const data = useMemo(() => {
    if (allData.length !== 0 && !allLoading) {
      return allData
    } else {
      return first100Data
    }
  }, [allData, first100Data, allLoading])

  // console.log(data.map((data)=> data.fields))

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
      first100Loading={first100Loading}
      allLoading={allLoading}
      first100Error={first100Error}
      allError={allError}
      pageTitle={'Animal Trial/Experiment'}
    />
  )
}

export default AnimalTrialExperiment
