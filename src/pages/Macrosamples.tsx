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
    'Sample type': string
    'Data type': string
    Description: string
    Container: string
    Preservative: string
    'ENA accession'?: string
    'ENA link'?: string
    'Metabolights accession'?: string
    'Metabolights link'?: string
  }
}

const Macrosample = (
  {
    displayTableHeader,
    displayTableFilters,
    displayTableBody,
    filterWith = [],
  }: {
    displayTableHeader?: boolean
    displayTableFilters?: boolean
    displayTableBody?: boolean
    filterWith?: { id: keyof TData['fields']; value: string | number; condition?: 'startsWith' | 'equals' }[]
  }) => {

  const { listOfSampleIdsThatHaveMetaboliteData = [], fetchMetaboliteError } = useMetaboliteExcelFileData()

  const data = intestinalSectionSampleData as unknown as TData[]
  // console.log(data.map((d) => d.fields))

  const tableDescription = "In 3D'omics we sampled two main types of samples: macrosamples, conventional-sized samples manually obtained from the animals, such as tissue sections, faeces and digesta samples, and microsamples, collected through laser microdissection for micro-scale spatial analyses. Macrosamples contain samples employed for direct nucleic acid and mass spectrometry analysis, as well as samples employed for downstream processing to obtain microsamples."


  // for cross reference tooltip
  const specimenLookup = useMemo(() => {
    return (animalSpecimenData as any[]).map((record) => record.fields);
  }, []);


  const filteredData = useMemo(() => {
    if (!filterWith || filterWith.length === 0) {
      return data
    }

    return (data).filter((record) => {
      return filterWith.every((filter) => {
        const fieldValue = record.fields[filter.id]

        if (fieldValue === undefined || fieldValue === null) return false

        const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue]
        const searchValue = String(filter.value).toLowerCase()

        if (filter.condition === 'startsWith') {
          return values.some((val) =>
            String(val).toLowerCase().startsWith(searchValue)
          )
        } else {
          return values.some((val) =>
            String(val).toLowerCase() === searchValue
          )
        }
      })
    })
  }, [filterWith])

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
      cell: (props: any) => (
        <Link
          to={`/macrosamples/${encodeURIComponent(props.row.original.fields.ID)}`}
          className='link'
        >
          {props.getValue()}
        </Link>
      )
    },
    {
      id: 'Individual',
      header: 'Animal Specimen',
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
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Code))),
      },
    },
    {
      id: 'Sample type',
      header: 'Sample Type',
      accessorFn: (row) => row.fields['Sample type'],
      filterFn: 'equals',
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields['Sample type']))),
      },
    },
    {
      id: 'Data type',
      header: 'Data Type',
      accessorFn: (row) => row.fields['Data type'],
      filterFn: 'equals',
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields['Data type']))),
      },
    },
    {
      id: 'Description',
      header: 'Description',
      accessorFn: (row) => row.fields.Description,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Description))),
      },
    },
    {
      id: 'Container',
      header: 'Container',
      accessorFn: (row) => row.fields.Container,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Container))),
      },
    },
    {
      id: 'Preservative',
      header: 'Preservative',
      accessorFn: (row) => row.fields.Preservative,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Preservative))),
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
  ], [filteredData, listOfSampleIdsThatHaveMetaboliteData, specimenLookup])




  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      fetchMetaboliteError={fetchMetaboliteError}
      pageTitle={'Macrosample'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
      tableDescription={tableDescription}
    />
  )
}

export default Macrosample
