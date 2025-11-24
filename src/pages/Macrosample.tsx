import { useMemo } from 'react'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'
import intestinalSectionSampleData from 'assets/data/airtable/intestinalsectionsample.json'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'
import { Link } from 'react-router-dom'


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
    'ENA accession'?: string
    'ENA link'?: string
    'Metabolights accession'?: string
    'Metabolights link'?: string
  }
}

const Macrosample = () => {

  const { listOfSampleIdsThatHaveMetaboliteData = [], fetchMetaboliteError } = useMetaboliteExcelFileData()

  const data = intestinalSectionSampleData as unknown as TData[]


  // for cross reference tooltip
  const specimenLookup = useMemo(() => {
    return (animalSpecimenData as any[]).map((record) => record.fields);
  }, []);

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
          value={cell.getValue() as string}
          data={specimenLookup}
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
      id: 'ENA Accession',
      header: 'ENA Accession',
      accessorFn: (row) => row.fields['ENA accession'],
      cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
        const enaLink = row.original.fields['ENA link'];
        return enaLink ? (
          <Link to={enaLink} target="_blank" rel="noopener noreferrer" className='link'>
            {cell.getValue() as string}
          </Link>
        ) : (
          <></>
        );
      }
    },
    {
      id: 'Metabolites Accession',
      header: 'Metabolites Accession',
      accessorFn: (row) => row.fields['Metabolights accession'],
      cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
        const metaboliteLink = row.original.fields['Metabolights link'];
        return metaboliteLink ? (
          <Link to={metaboliteLink} target="_blank" rel="noopener noreferrer" className='link'>
            {cell.getValue() as string}
          </Link>
        ) : (
          <></>
        );
      }
    },
    // ⬇️ Put this back when the Macrosample airtable has added sample that have metabolite data
    // {
    //   id: 'Metabolite',
    //   header: 'Metabolite Data',
    //   accessorFn: (row) => listOfSampleIdsThatHaveMetaboliteData.includes(row.fields.ID) ? 'Yes' : 'No',
    //   enableSorting: false,
    //   meta: {
    //     filterVariant: 'select' as const,
    //     uniqueValues: ['Yes', 'No'],
    //   }
    // },
  ], [data, listOfSampleIdsThatHaveMetaboliteData, specimenLookup])




  return (
    <TableView<TData>
      data={data}
      columns={columns}
      fetchMetaboliteError={fetchMetaboliteError}
      pageTitle={'Macrosample'}
    />
  )
}

export default Macrosample
