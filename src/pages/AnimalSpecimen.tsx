import { useMemo } from 'react'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import { airtableConfig } from 'config/airtable'

type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    Experiment: string
    Experiment_flat: string
    Treatment: string
    Treatment_flat: string
    TreatmentName: string
    Pen: string
    SlaughteringDayCount: number
    SlaughteringDate: string
    Weight: number
  }
}

const AnimalSpecimen = ({ displayTableHeader, displayTableFilters, displayTableBody, filterWith = [] }: {
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  filterWith?: { id: string, value: string | number, condition?: string }[]
}) => {

  const { animalSpecimenBaseId, animalSpecimenTableId, animalSpecimenViewId, animalTrialExperimentBaseId, animalTrialExperimentTableId } = airtableConfig

  const { first100Data, first100Loading, first100Error, allData, allLoading, allError, } = useGetFirst100Data({
    AIRTABLE_BASE_ID: animalSpecimenBaseId,
    AIRTABLE_TABLE_ID: animalSpecimenTableId,
    AIRTABLE_VIEW_ID: animalSpecimenViewId,
    filterWith,
  })

  const data = useMemo(() => {
    if (allData.length !== 0 && !allLoading) {
      return allData
    } else {
      return first100Data
    }
  }, [allData, first100Data, allLoading])

  // console.log(allData.map((d) => d.fields))

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
    },
    {
      id: 'Experiment_flat',
      header: 'Experiment',
      accessorFn: (row) => row.fields.Experiment_flat,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Experiment_flat))),
      },
      cell: ({ cell, row }: { cell: { getValue: () => any }, row: { original: TData } }) => (
        // cell: ({ cell, row }: CellContext<TData, string>) => (
        <CrossReferenceTooltip<TData>
          AIRTABLE_BASE_ID={animalTrialExperimentBaseId}
          AIRTABLE_TABLE_ID={animalTrialExperimentTableId}
          RECORD_ID={row.original.fields.Experiment}
          value={cell.getValue()}
          fieldsName={[
            { key: 'ID', value: 'ID' },
            { key: 'Name', value: 'Name' },
            { key: 'Type', value: 'Type' },
            { key: 'Start date', value: 'StartDate' },
            { key: 'End date', value: 'EndDate' }
          ]}
        />
      ),
    },
    {
      id: 'Treatment_flat',
      header: 'Treatment',
      accessorFn: (row) => row.fields.Treatment_flat,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Treatment_flat))),
      },
    },
    {
      id: 'TreatmentName',
      header: 'Treatment Name',
      accessorFn: (row) => row.fields.TreatmentName?.[0],
      filterFn: 'equals',
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.TreatmentName?.[0]))),
      },
    },
    {
      id: 'Pen',
      header: 'Pen',
      accessorFn: (row) => row.fields.Pen,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Pen))),
      },
    },
    {
      id: 'SlaughteringDayCount',
      header: 'Slaughtering Day Count',
      accessorFn: (row) => row.fields.SlaughteringDayCount,
      enableColumnFilter: false,
    },
    {
      id: 'SlaughteringDate',
      header: 'Slaughtering Date',
      accessorFn: (row) => row.fields.SlaughteringDate,
      enableColumnFilter: false,
    },
    {
      id: 'Weight',
      header: 'Weight',
      accessorFn: (row) => row.fields.Weight,
      enableColumnFilter: false,
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
      pageTitle={'Animal Specimen'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default AnimalSpecimen

