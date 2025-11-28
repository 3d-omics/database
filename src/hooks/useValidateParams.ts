import { useMemo } from 'react';
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json';
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json';
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json';
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json';
import cryosectionData from 'assets/data/airtable/cryosection.json';

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, any>;
}

export default function useValidateParams({
  tableType,
  filterId,
  filterValue
}: {
  tableType: 'animalTrialExperiment' | 'cryosectionImage' | 'animalSpecimen' | 'macrosample' | 'cryosection';
  filterId: string;
  filterValue: string;
}) {

  // Get the appropriate dataset
  const dataset = useMemo(() => {
    const dataMap = {
      animalTrialExperiment: animalTrialExperimentData as AirtableRecord[],
      animalSpecimen: animalSpecimenData as AirtableRecord[],
      cryosectionImage: cryosectionImageData as AirtableRecord[],
      macrosample: macrosampleData as AirtableRecord[],
      cryosection: cryosectionData as AirtableRecord[],
    };
    return dataMap[tableType];
  }, [tableType]);

  // Filter the data
  const filteredData = useMemo(() => {
    return dataset.filter((record) => {
      const fieldValue = record.fields[filterId];

      if (fieldValue === undefined || fieldValue === null) return false;

      const values = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
      const searchValue = String(filterValue).toLowerCase();

      // Exact match (case-insensitive)
      return values.some((val) =>
        String(val).toLowerCase() === searchValue
      );
    });
  }, [dataset, filterId, filterValue]);

  const isNotFound = filteredData.length === 0;

  return {
    data: filteredData,
    validating: false,  // No validation needed - data is instant
    error: null,         // No errors with static data
    notFound: isNotFound,
  };
}
