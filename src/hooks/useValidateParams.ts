import useGetFirst100Data from 'hooks/useGetFirst100Data'
import { airtableConfig } from 'config/airtable'

export default function useValidateParams({ tableType, filterId, filterValue }: {
  tableType: 'animalTrialExperiment' | 'cryosectionImage',
  filterId: string,
  filterValue: string
}) {

  const configMap = {
    animalTrialExperiment: {
      baseId: airtableConfig.animalTrialExperimentBaseId,
      tableId: airtableConfig.animalTrialExperimentTableId,
      viewId: airtableConfig.animalTrialExperimentViewId,
    },
    cryosectionImage: {
      baseId: airtableConfig.cryosectionImageBaseId,
      tableId: airtableConfig.cryosectionImageTableId,
      viewId: airtableConfig.cryosectionImageViewId,
    },
  }

  const { baseId, tableId, viewId } = configMap[tableType]

  const { first100Data, first100Loading, first100Error, hasFetchedAllData } = useGetFirst100Data({
    AIRTABLE_BASE_ID: baseId,
    AIRTABLE_TABLE_ID: tableId,
    AIRTABLE_VIEW_ID: viewId,
    filterWith: [{ id: filterId, value: filterValue }]
  })

  const isNotFound =
    hasFetchedAllData &&
    !first100Loading &&
    Array.isArray(first100Data) &&
    first100Data.length === 0 &&
    !first100Error

  return {
    data: first100Data,
    validating: first100Loading || !hasFetchedAllData,
    error: first100Error,
    notFound: isNotFound
  }

}