import { useMemo } from 'react'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import { ColumnDef } from '@tanstack/react-table'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import TableView from 'components/TableView'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'
import { airtableConfig } from 'config/airtable'


type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    Experiment_code: string
    ExperimentalUnit_Series: string
    Individual: string
    Code: string
    Type: string
    Description: string
    Container: string
    Preservative: string
  }
}

const IntestinalSectionSample = () => {

  const { listOfSampleIdsThatHaveMetaboliteData = [], fetchMetaboliteError } = useMetaboliteExcelFileData()
  const { intestinalSectionSampleBaseId, intestinalSectionSampleTableId, intestinalSectionSampleViewId, animalSpecimenBaseId, animalSpecimenTableId } = airtableConfig

  const { first100Data, first100Loading, first100Error, allData, allLoading, allError } = useGetFirst100Data({
    AIRTABLE_BASE_ID: intestinalSectionSampleBaseId,
    AIRTABLE_TABLE_ID: intestinalSectionSampleTableId,
    AIRTABLE_VIEW_ID: intestinalSectionSampleViewId,
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
      id: 'Individual',
      header: 'Experimental Unit Series',
      accessorFn: (row) => row.fields.Individual,
      cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => (
        <CrossReferenceTooltip
          AIRTABLE_BASE_ID={animalSpecimenBaseId}
          AIRTABLE_TABLE_ID={animalSpecimenTableId}
          RECORD_ID={row.original.fields.ExperimentalUnit_Series}
          value={cell.getValue() as string}
          fieldsName={[
            { key: 'ID', value: 'ID' },
            { key: 'Treatment', value: 'Treatment_flat' },
            { key: 'Treatment name', value: 'TreatmentName' },
            { key: 'Pen', value: 'Pen' },
            { key: 'Slaughtering day count', value: 'SlaughteringDayCount' },
            { key: 'Slaughtering date', value: 'SlaughteringDate' },
            { key: 'Weight', value: 'Weight' },
          ]}
        />
      ),
    },
    {
      id: 'Code',
      header: 'Code',
      accessorFn: (row) => row.fields.Code,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Code))),
      },
    },
    {
      id: 'Type',
      header: 'Type',
      accessorFn: (row) => row.fields.Type,
      filterFn: 'equals',
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Type))),
      },
    },
    {
      id: 'Description',
      header: 'Description',
      accessorFn: (row) => row.fields.Description,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Description))),
      },
    },
    {
      id: 'Container',
      header: 'Container',
      accessorFn: (row) => row.fields.Container,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Container))),
      },
    },
    {
      id: 'Preservative',
      header: 'Preservative',
      accessorFn: (row) => row.fields.Preservative,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.fields.Preservative))),
      },
    },
    {
      id: 'Metabolite',
      header: 'Metabolite Data',
      accessorFn: (row) => listOfSampleIdsThatHaveMetaboliteData.includes(row.fields.ID) ? 'Yes' : 'No',
      enableSorting: false,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: ['Yes', 'No'],
      }
    },
  ], [data, listOfSampleIdsThatHaveMetaboliteData])




  return (
    <TableView<TData>
      data={data}
      columns={columns}
      first100Loading={first100Loading}
      allLoading={allLoading}
      first100Error={first100Error}
      allError={allError}
      fetchMetaboliteError={fetchMetaboliteError}
      pageTitle={'Intestinal Section Sample'}
    />
  )
}

export default IntestinalSectionSample