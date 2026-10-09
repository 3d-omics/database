import { useMemo, useState, Dispatch, SetStateAction } from 'react'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import intestinalSectionSampleData from 'assets/data/airtable/intestinalsectionsample.json'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'
import useSampleIdentifiers, { MacrosampleIdentifiers } from 'hooks/useSampleIdentifiers'
import { Link } from 'react-router-dom'
import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'
import { mergeExcelWithAirtableData } from 'pages/Macrosamples/utils/mergeMetaboliteData';
import { getExperimentOptions } from 'config/metaboliteOptions'
import ErrorBanner from 'components/ErrorBanner'
import Loading from 'components/Loading'

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
    'BioSamples accession'?: string
    Group?: string
    DPI?: string
    Treatment?: string
  }
}

type AnalysisScale = 'all' | 'macro' | 'micro'

const analysisScaleOptions: { value: AnalysisScale; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'macro', label: 'Macro-scale analyses' },
  { value: 'micro', label: 'Micro-scale analyses' },
]

const Macrosample = (
  {
    displayPageHeader = true,
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
    setCheckedMetaboliteIds,
    experimentId,
  }: {
    displayPageHeader?: boolean
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
    experimentId?: string
  }) => {


  const data = intestinalSectionSampleData as unknown as TData[]
  const macrosampleIdentifiers = useSampleIdentifiers<MacrosampleIdentifiers>('macro')
  const [analysisScale, setAnalysisScale] = useState<AnalysisScale>('all')
  const showAnalysisFilters = displayPageHeader && !macrosampleWithMetaboliteData

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

  const { sampleMetaDataSheet, fetchMetaboliteError } = useMetaboliteExcelFileData({
    experimentId: experimentId || '',
    skip: !macrosampleWithMetaboliteData
  })

  const mergedData = useMemo(() => {
    return mergeExcelWithAirtableData(sampleMetaDataSheet, filteredData)
  }, [sampleMetaDataSheet, filteredData])

  const isDataReady = useMemo(() => {
    if (!macrosampleWithMetaboliteData) {
      return true
    }
    return sampleMetaDataSheet !== null && sampleMetaDataSheet !== undefined
  }, [macrosampleWithMetaboliteData, sampleMetaDataSheet])

  // Glycerol-preserved whole sections are collected for cryosection and
  // microsample analyses, including sections not yet released as cryosections.
  const dataToUse = useMemo(() => {
    const source = macrosampleWithMetaboliteData ? mergedData : filteredData
    if (!showAnalysisFilters || analysisScale === 'all') return source
    return source.filter((record) =>
      (record.fields.Preservative === 'Glycerol') === (analysisScale === 'micro')
    )
  }, [macrosampleWithMetaboliteData, mergedData, filteredData, showAnalysisFilters, analysisScale])

  const recordFilterControls = showAnalysisFilters ? (
    <div role='group' aria-label='Filter macrosamples by analysis scale' className='inline-flex flex-wrap gap-1 rounded-lg border border-line bg-surface_muted p-1'>
      {analysisScaleOptions.map(({ value, label }) => (
        <button
          key={value}
          type='button'
          aria-pressed={analysisScale === value}
          onClick={() => setAnalysisScale(value)}
          className={`rounded-md px-3 py-1.5 font-jakarta font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy_ink ${analysisScale === value
            ? 'bg-burgundy text-white shadow-sm'
            : 'text-ink_muted hover:bg-surface hover:text-burgundy_ink'}`}
        >
          {label}
        </button>
      ))}
    </div>
  ) : undefined

  const defaultColumns = useMemo<ColumnDef<TData>[]>(() => {

    const baseColumns: ColumnDef<TData>[] = [
      {
        id: 'ID',
        header: 'ID',
        accessorFn: (row) => row.fields.ID,
        cell: (props: any) => (
          <Link
            to={`/macrosamples/${encodeURIComponent(props.row.original.fields.ID)}`}
            className='table_link'
          >
            {props.getValue()}
          </Link>
        )
      },
      {
        id: 'BioSamples accession',
        header: 'BioSamples',
        accessorFn: (row) => [
          row.fields['BioSamples accession'],
          ...(macrosampleIdentifiers[row.fields.ID]?.sequencing_biosample_accessions ?? []),
        ].filter(Boolean).join(', '),
        cell: ({ row }) => {
          const material = row.original.fields['BioSamples accession']
          const sequencing = macrosampleIdentifiers[row.original.fields.ID]?.sequencing_biosample_accessions ?? []
          const distinctSequencing = sequencing.filter((accession) => accession !== material)
          if (!material && distinctSequencing.length === 0) return null
          return <div className='flex flex-col gap-1'>
            {material && <div><span className='mr-1 text-xs text-ink_muted'>{sequencing.includes(material) ? 'Material, sequencing' : 'Material'}</span><a href={`https://www.ebi.ac.uk/biosamples/samples/${encodeURIComponent(material)}`} target='_blank' rel='noopener noreferrer' className='table_link'>{material}</a></div>}
            {distinctSequencing.map((accession) => <div key={accession}><span className='mr-1 text-xs text-ink_muted'>Sequencing</span><a href={`https://www.ebi.ac.uk/biosamples/samples/${encodeURIComponent(accession)}`} target='_blank' rel='noopener noreferrer' className='table_link'>{accession}</a></div>)}
          </div>
        },
      },
      {
        id: 'INSDC sample accessions',
        header: 'INSDC samples',
        accessorFn: (row) => [...new Set([
          ...(macrosampleIdentifiers[row.fields.ID]?.material_insdc_sample_accessions ?? []),
          ...(macrosampleIdentifiers[row.fields.ID]?.sequencing_insdc_sample_accessions ?? []),
        ])].join(', '),
        cell: ({ row }) => [...new Set([
          ...(macrosampleIdentifiers[row.original.fields.ID]?.material_insdc_sample_accessions ?? []),
          ...(macrosampleIdentifiers[row.original.fields.ID]?.sequencing_insdc_sample_accessions ?? []),
        ])].map((accession) =>
          <a key={accession} href={`https://www.ebi.ac.uk/ena/browser/view/${encodeURIComponent(accession)}`} target='_blank' rel='noopener noreferrer' className='table_link block'>{accession}</a>
        ),
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
        id: 'Description',
        header: macrosampleWithMetaboliteData ? 'Sample type' : 'Description',
        accessorFn: (row) => row.fields.Description,
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Description))),
        },
      },

      {
        id: 'Metabolights accession',
        header: 'Metabolites Accession',
        accessorFn: (row) => row.fields['Metabolights accession'],
        cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
          const metaboliteLink = row.original.fields['Metabolights link']
          return metaboliteLink ? (
            <Link to={metaboliteLink} target='_blank' rel='noopener noreferrer' className='table_link'>
              {cell.getValue() as string}
            </Link>
          ) : (
            <></>
          )
        }
      }
    ]

    // for metabolite heatmap table
    if (macrosampleWithMetaboliteData) {
      baseColumns.splice(0, 0, {
        id: 'Metabolite',
        accessorFn: (row) => macrosampleWithMetaboliteData.includes(row.fields.ID) ? 'Yes' : 'No',
        enableSorting: false,
        enableColumnFilter: false,
        header: (context) => {
          const filteredRows = context.table.getFilteredRowModel().rows
          const filteredSampleIds = filteredRows.map((row: any) => row.original.fields.ID)
          return (
            <div className='flex flex-col justify-center gap-4'>
              <p className='text-center'>Heatmap comparison</p>
              <input
                type='checkbox'
                className='accent-mustard tooltip tooltip-top !bg-surface !text-ink'
                data-tip='check to compare all samples'
                checked={
                  filteredSampleIds.length > 0 &&
                  filteredSampleIds.every((id: string) => checkedMetaboliteIds?.includes(id))
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    // Add all filtered sample IDs
                    const newChecked = [...new Set([...(checkedMetaboliteIds || []), ...filteredSampleIds])]
                    setCheckedMetaboliteIds?.(newChecked)
                  } else {
                    // Remove all filtered sample IDs
                    setCheckedMetaboliteIds?.(
                      checkedMetaboliteIds?.filter((id) => !filteredSampleIds.includes(id)) || []
                    )
                  }
                }}
              />
            </div>
          )
        },
        cell: (props: any) => {
          const id = props.row.original.fields.ID
          return <div className='flex justify-center items-center'>
            <input
              type='checkbox'
              className='accent-mustard tooltip tooltip-right !bg-surface !text-ink'
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

      if (dataToUse.some((row) => row.fields.Treatment)) {
        const allOptions = getExperimentOptions(experimentId || '')
        const treatmentOptions = allOptions.Treatment
        baseColumns.splice(4, 0, {
          id: 'Treatment',
          header: 'Treatment',
          accessorFn: (row) => row.fields.Treatment,
          cell: ({ cell }: { cell: { getValue: () => string | unknown } }) => {
            const value = cell.getValue() as string
            return <span>
              {treatmentOptions?.[value] || value}
            </span>
          },
          filterFn: (row, columnId, filterValue) => {
            const rowValue = row.getValue(columnId) as string
            const rowDisplayValue = treatmentOptions?.[rowValue] || rowValue
            return rowDisplayValue === filterValue
          },
          meta: {
            filterVariant: 'select' as const,
            uniqueValues: Array.from(
              new Set(
                dataToUse
                  .map((row) => row.fields.Treatment)
                  .filter(Boolean)
                  .map((code) => treatmentOptions?.[code as string] || code)
              )
            ),
          },
        })
      }

      if (dataToUse.some((row) => row.fields.DPI)) {
        baseColumns.splice(4, 0, {
          id: 'DPI',
          header: 'Days Post Infection',
          accessorFn: (row) => row.fields.DPI?.toString(),
          filterFn: 'equals',
          meta: {
            filterVariant: 'select' as const,
            uniqueValues: Array.from(new Set(mergedData.map((row) => row.fields.DPI?.toString()).filter(Boolean))),
          },
        })
      }

      if (dataToUse.some((row) => row.fields.Group)) {
        baseColumns.splice(4, 0, {
          id: 'Group',
          header: 'Group',
          accessorFn: (row) => row.fields.Group,
          filterFn: 'equals',
          meta: {
            filterVariant: 'select' as const,
            uniqueValues: Array.from(new Set(mergedData.map((row) => row.fields.Group).filter(Boolean))),
          },
        })
      }

    }

    // for regular macrosample table
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

      baseColumns.splice(3, 0, {
        id: 'Sample type',
        header: 'Sample Type',
        accessorFn: (row) => row.fields['Sample type'],
        filterFn: 'equals',
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields['Sample type']))),
        },
      },)

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

      baseColumns.splice(6, 0, {
        id: 'Container',
        header: 'Container',
        accessorFn: (row) => row.fields.Container,
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Container))),
        },
      })

      baseColumns.splice(7, 0, {
        id: 'Preservative',
        header: 'Preservative',
        accessorFn: (row) => row.fields.Preservative,
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Preservative))),
        },
      })

      baseColumns.splice(8, 0, {
        id: 'ENA accession',
        header: 'ENA Accession',
        accessorFn: (row) => row.fields['ENA accession'],
        cell: ({ cell, row }: { cell: { getValue: () => string | unknown }, row: { original: TData } }) => {
          const enaLink = row.original.fields['ENA link']
          return enaLink ? (
            <Link to={enaLink} target='_blank' rel='noopener noreferrer' className='table_link'>
              {cell.getValue() as string}
            </Link>
          ) : (
            <></>
          )
        }
      })
    }
    return baseColumns
  }, [filteredData, specimenLookup, macrosampleWithMetaboliteData, checkedMetaboliteIds, setCheckedMetaboliteIds, dataToUse, mergedData, macrosampleIdentifiers])

  const columns = customColumns ?? defaultColumns

  // Show error if there was a problem fetching metabolite data
  if (fetchMetaboliteError) {
    return (
      <div className='page_padding min-h-dvh'>
        <ErrorBanner>{fetchMetaboliteError}</ErrorBanner>
      </div>
    )
  }

  // Show loading state while waiting for metabolite data to merge
  if (!isDataReady) {
    return (
      <div className='page_padding min-h-dvh'><Loading /></div>
    )
  }

  return (
    <TableView<TData>
      data={dataToUse as TData[]}
      columns={columns}
      pageTitle={pageTitle}
      displayPageHeader={displayPageHeader}
      displayTableHeader={displayTableHeader}
      displayTableDescription={displayTableDescription}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
      tableDescription={tableDescription}
      recordFilterControls={recordFilterControls}
    />
  )
}

export default Macrosample
