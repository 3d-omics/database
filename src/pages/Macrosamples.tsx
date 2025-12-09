import { useMemo } from 'react'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'
import intestinalSectionSampleData from 'assets/data/airtable/intestinalsectionsample.json'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'
import { Link } from 'react-router-dom'
import experimentI from "assets/data/metabolomics/metabolomics_I.xlsx"
import experimentJ from "assets/data/metabolomics/metabolomics_J.xlsx"
import experimentK from "assets/data/metabolomics/metabolomics_K.xlsx"
import experimentG from "assets/data/metabolomics/metabolomics_G.xlsx"
// import { macrosampleWithMetaboliteData } from 'config/macrosampleWithMetaboliteData'


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
    displayTableDescription,
    displayTableFilters,
    displayTableBody,
    filterWith = [],
    customColumns,
    macrosampleWithMetaboliteData
  }: {
    displayTableHeader?: boolean
    displayTableDescription?: boolean
    displayTableFilters?: boolean
    displayTableBody?: boolean
    filterWith?: { id: keyof TData['fields']; value: string | number; condition?: 'startsWith' | 'equals' }[]
    customColumns?: ColumnDef<TData>[]
    macrosampleWithMetaboliteData?: string[]
  }) => {

  const { listOfSampleIdsThatHaveMetaboliteData = [], fetchMetaboliteError } = useMetaboliteExcelFileData()

  const data = intestinalSectionSampleData as unknown as TData[]
  // console.log(data.map((d) => d.fields))

  const tableDescription = "In 3D'omics we sampled two main types of samples: macrosamples, conventional-sized samples manually obtained from the animals, such as tissue sections, faeces and digesta samples, and microsamples, collected through laser microdissection for micro-scale spatial analyses. Macrosamples contain samples employed for direct nucleic acid and mass spectrometry analysis, as well as samples employed for downstream processing to obtain microsamples."


  // for cross reference tooltip
  const specimenLookup = useMemo(() => {
    return (animalSpecimenData as any[]).map((record) => record.fields);
  }, []);

  const files = {
    'G': experimentG,
    // 'H': experimentH,
    'I': experimentI,
    'J': experimentJ,
    'K': experimentK,
    // 'M': experimentM
  }


  const filteredData = useMemo(() => {
    let result = data;

    // First filter by macrosampleWithMetaboliteData if provided
    if (macrosampleWithMetaboliteData && macrosampleWithMetaboliteData.length > 0) {
      result = result.filter((record) =>
        macrosampleWithMetaboliteData.includes(record.fields.ID)
      );
    }

    // Then apply filterWith conditions
    if (filterWith && filterWith.length > 0) {
      result = result.filter((record) => {
        return filterWith.every((filter) => {
          const fieldValue = record.fields[filter.id];

          if (fieldValue === undefined || fieldValue === null) return false;

          const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
          const searchValue = String(filter.value).toLowerCase();

          if (filter.condition === 'startsWith') {
            return values.some((val) =>
              String(val).toLowerCase().startsWith(searchValue)
            );
          } else {
            return values.some((val) =>
              String(val).toLowerCase() === searchValue
            );
          }
        });
      });
    }

    return result;
  }, [filterWith, macrosampleWithMetaboliteData]);



  const defaultColumns = useMemo<ColumnDef<TData>[]>(() => {
    const isHeatmapPage = window.location.href.includes('heatmap');

    const baseColumns: ColumnDef<TData>[] = [
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
      }
    ];

    if (macrosampleWithMetaboliteData) {
      baseColumns.push({
        id: 'Metabolite',
        header: 'Check to compare heatmap',
        accessorFn: (row) => macrosampleWithMetaboliteData.includes(row.fields.ID) ? 'Yes' : 'No',
        enableSorting: false,
        enableColumnFilter: false,
        // meta: {
        //   filterVariant: 'select' as const,
        //   uniqueValues: ['Yes', 'No'],
        // }
      });
    }

    return baseColumns;
  }, [filteredData, specimenLookup])

  const columns = customColumns ?? defaultColumns

  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      fetchMetaboliteError={fetchMetaboliteError}
      pageTitle={'Macrosample'}
      displayTableHeader={displayTableHeader}
      displayTableDescription={displayTableDescription}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
      tableDescription={tableDescription}
    />
  )
}

export default Macrosample
