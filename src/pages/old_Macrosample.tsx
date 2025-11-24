import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import TableView from 'components/TableView'
import CrossReferenceTooltip from 'components/CrossReferenceTooltip'
import macrosampleData from 'assets/data/airtable/macrosample.json'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'


export type TData = {
  id: string
  createdTime: string
  fields: {
    ID: string
    ExperimentalUnitIndexedLibrary: string
  }
}

const Macrosample = ({ displayTableHeader, displayTableFilters, displayTableBody, filterWith = [] }: {
  displayTableHeader?: boolean
  displayTableFilters?: boolean
  displayTableBody?: boolean
  filterWith?: { id: keyof TData['fields']; value: string | number; condition?: 'startsWith' | 'equals' }[];
}) => {

  const data = macrosampleData as unknown as TData[];

  // for cross reference tooltip
    const specimenLookup = useMemo(() => {
      return (animalSpecimenData as any[]).map((record) => record.fields);
    }, []);

  const filteredData = useMemo(() => {
    if (!filterWith || filterWith.length === 0) {
      return data;
    }

    return (data).filter((record) => {
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
  }, [filterWith]);

  const columns = useMemo<ColumnDef<TData>[]>(() => [
    {
      id: 'ID',
      header: 'ID',
      accessorFn: (row) => row.fields.ID,
    },
    {
      id: 'ExperimentalUnitIndexedLibrary',
      header: 'Animal Specimen ID',
      accessorFn: (row) => row.fields.ExperimentalUnitIndexedLibrary?.[0],
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
  ], [filteredData, specimenLookup])



  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      pageTitle={'Macrosample'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  )
}

export default Macrosample
