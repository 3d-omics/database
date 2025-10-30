import { useMemo } from 'react';
import CrossReferenceTooltip from 'components/CrossReferenceTooltip';
import { ColumnDef } from '@tanstack/react-table';
import TableView from 'components/TableView';
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json';
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json';

type TData = {
  id: string;
  createdTime: string;
  fields: {
    ID: string;
    Experiment: string;
    Experiment_flat: string;
    Treatment: string;
    Treatment_flat: string;
    TreatmentName: string;
    Pen: string;
    SlaughteringDayCount: number;
    SlaughteringDate: string;
    Weight: number;
  };
};

const AnimalSpecimen = ({
  displayTableHeader,
  displayTableFilters,
  displayTableBody,
  filterWith = [],
}: {
  displayTableHeader?: boolean;
  displayTableFilters?: boolean;
  displayTableBody?: boolean;
  filterWith?: { id: keyof TData['fields']; value: string | number; condition?: 'startsWith' | 'equals' }[];
}) => {

  const data = animalSpecimenData as unknown as TData[];

  // for cross reference tooltip
  const experimentLookup = useMemo(() => {
    return (animalTrialExperimentData as any[]).map((record) => record.fields);
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


  const columns = useMemo<ColumnDef<TData>[]>(
    () => [
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
          uniqueValues: Array.from(
            new Set(filteredData.map((row) => row.fields.Experiment_flat))
          ),
        },
        cell: ({ cell, row }: { cell: { getValue: () => any }; row: { original: TData }; }) => (
          <CrossReferenceTooltip
            value={cell.getValue()}
            data={experimentLookup}
            fieldsName={[
              { key: 'ID', value: 'ID' },
              { key: 'Name', value: 'Name' },
              { key: 'Type', value: 'Type' },
              { key: 'Start date', value: 'StartDate' },
              { key: 'End date', value: 'EndDate' },
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
          uniqueValues: Array.from(
            new Set(filteredData.map((row) => row.fields.Treatment_flat))
          ),
        },
      },
      {
        id: 'TreatmentName',
        header: 'Treatment Name',
        accessorFn: (row) => row.fields.TreatmentName?.[0],
        filterFn: 'equals',
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(
            new Set(filteredData.map((row) => row.fields.TreatmentName?.[0]))
          ),
        },
      },
      {
        id: 'Pen',
        header: 'Pen',
        accessorFn: (row) => row.fields.Pen,
        meta: {
          filterVariant: 'select' as const,
          uniqueValues: Array.from(new Set(filteredData.map((row) => row.fields.Pen))),
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
    ],
    [filteredData, experimentLookup]
  );

  return (
    <TableView<TData>
      data={filteredData}
      columns={columns}
      pageTitle={'Animal Specimen'}
      displayTableHeader={displayTableHeader}
      displayTableFilters={displayTableFilters}
      displayTableBody={displayTableBody}
    />
  );
};

export default AnimalSpecimen;

