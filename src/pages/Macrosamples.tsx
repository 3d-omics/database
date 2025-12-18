import { useMemo, Dispatch, SetStateAction } from 'react'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
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
    displayTableDescription,
    displayTableFilters,
    displayTableBody,
    filterWith = [],
    customColumns,
    macrosampleWithMetaboliteData,
    pageTitle = 'Macrosamples',
    tableDescription = "In 3D'omics we sampled two main types of samples: macrosamples, conventional-sized samples manually obtained from the animals, such as tissue sections, faeces and digesta samples, and microsamples, collected through laser microdissection for micro-scale spatial analyses. Macrosamples contain samples employed for direct nucleic acid and mass spectrometry analysis, as well as samples employed for downstream processing to obtain microsamples.",
    checkedMetaboliteIds,
    setCheckedMetaboliteIds
  }: {
    displayTableHeader?: boolean
    displayTableDescription?: boolean
    displayTableFilters?: boolean
    displayTableBody?: boolean
    filterWith?: { id: keyof TData['fields']; value: string | number; condition?: 'startsWith' | 'equals' }[]
    customColumns?: ColumnDef<TData>[]
    macrosampleWithMetaboliteData?: string[]
    pageTitle?: string
    tableDescription?: string,
    checkedMetaboliteIds?: string[]
    setCheckedMetaboliteIds?: Dispatch<SetStateAction<string[]>>
  }) => {

  const data = intestinalSectionSampleData as unknown as TData[]

  // for cross reference tooltip
  const specimenLookup = useMemo(() => {
    return (animalSpecimenData as any[]).map((record) => record.fields)
  }, [])

  const filteredData = useMemo(() => {
    let result = data

    // First filter by macrosampleWithMetaboliteData if provided
    if (macrosampleWithMetaboliteData && macrosampleWithMetaboliteData.length > 0) {
      result = result.filter((record) =>
        macrosampleWithMetaboliteData.includes(record.fields.ID)
      )
    }

    // Then apply filterWith conditions
    if (filterWith && filterWith.length > 0) {
      result = result.filter((record) => {
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
    }
    return result
  }, [filterWith, macrosampleWithMetaboliteData, data])

  const defaultColumns = useMemo<ColumnDef<TData>[]>(() => {

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
        id: 'Metabolights accession',
        header: 'Metabolites Accession',
        accessorFn: (row) => row.fields['Metabolights accession'],
        cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
          const metaboliteLink = row.original.fields['Metabolights link']
          return metaboliteLink ? (
            <Link to={metaboliteLink} target='_blank' rel='noopener noreferrer' className='link'>
              {cell.getValue() as string}
            </Link>
          ) : (
            <></>
          )
        }
      }
    ]

    if (macrosampleWithMetaboliteData) {
      baseColumns.splice(0, 0, {
        id: 'Metabolite',
        accessorFn: (row) => macrosampleWithMetaboliteData.includes(row.fields.ID) ? 'Yes' : 'No',
        enableSorting: false,
        enableColumnFilter: false,
        header: () => (
          <div className='flex flex-col justify-center gap-4'>
            <p className='text-center'>Heatmap comparison</p>
            <input
              type='checkbox'
              className='accent-mustard tooltip tooltip-top !bg-white !text-custom_black'
              data-tip='check to compare all samples'
              checked={checkedMetaboliteIds?.length === macrosampleWithMetaboliteData.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedMetaboliteIds?.(macrosampleWithMetaboliteData)
                } else {
                  setCheckedMetaboliteIds?.([])
                }
              }}
            />
          </div>
        ),
        cell: (props: any) => {
          const id = props.row.original.fields.ID
          return <div className='flex justify-center items-center'>
            <input
              type='checkbox'
              className='accent-mustard tooltip tooltip-right !bg-white !text-custom_black'
              data-tip='check samples to view/compare'
              checked={checkedMetaboliteIds?.includes(id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedMetaboliteIds?.([...(checkedMetaboliteIds || []), id])
                } else {
                  setCheckedMetaboliteIds?.(checkedMetaboliteIds?.filter((checkedId) => checkedId !== id) || [])
                }
              }}
              data-testid='metabolite-checkbox'
            />
          </div>
        }
      })
    }

    if (!macrosampleWithMetaboliteData) {
      baseColumns.splice(2, 0, {
        id: 'Code',
        header: 'Code',
        accessorFn: (row) => row.fields.Code,
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Code))),
        },
      })

      baseColumns.splice(4, 0, {
        id: 'Data type',
        header: 'Data Type',
        accessorFn: (row) => row.fields['Data type'],
        filterFn: 'equals',
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields['Data type']))),
        }
      })

      baseColumns.splice(8, 0, {
        id: 'ENA accession',
        header: 'ENA Accession',
        accessorFn: (row) => row.fields['ENA accession'],
        cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
          const enaLink = row.original.fields['ENA link']
          return enaLink ? (
            <Link to={enaLink} target='_blank' rel='noopener noreferrer' className='link'>
              {cell.getValue() as string}
            </Link>
          ) : (
            <></>
          )
        }
      })
    }
    return baseColumns
  }, [filteredData, specimenLookup, macrosampleWithMetaboliteData, checkedMetaboliteIds, setCheckedMetaboliteIds])

  const columns = customColumns ?? defaultColumns

  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      pageTitle={pageTitle}
      displayTableHeader={displayTableHeader}
      displayTableDescription={displayTableDescription}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
      tableDescription={tableDescription}
    />
  )
}

export default Macrosample
