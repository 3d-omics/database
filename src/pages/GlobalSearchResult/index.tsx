import { useEffect } from 'react'
import useGlobalSearch from 'hooks/useGlobalSearch'
import ResultTable from './ResultTable'
import { useLocation } from 'react-router-dom'
import LoadingRemainingData from 'components/LoadingRemainingData'
import { airtableConfig } from 'config/airtable'

const GlobalSearchResult = () => {

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const keyword = searchParams.get('keyword') || ''
  const { animalTrialExperimentBaseId, animalTrialExperimentTableId, animalTrialExperimentViewId,
    animalSpecimenBaseId, animalSpecimenTableId, animalSpecimenViewId,
    intestinalSectionSampleBaseId, intestinalSectionSampleTableId, intestinalSectionSampleViewId,
    cryosectionBaseId, cryosectionTableId, cryosectionViewId,
    microsampleBaseId, microsampleTableId, microsampleViewId
  } = airtableConfig

  useEffect(() => {
    getAnimalTrialExperimentData()
    getAnimalSpecimenData()
    getIntestinalSectionSampleData()
    getCryosectionData()
    getMicrosampleData()
  }, [keyword])

  const animalTrialExperimentFields = [
    { name: 'ID', type: 'string', columnName: 'ID' },
    { name: 'Name', type: 'string', columnName: 'Name' },
    { name: 'Type', type: 'string', columnName: 'Type' },
    { name: 'StartDate', type: 'string', columnName: 'Start date' },
    { name: 'EndDate', type: 'string', columnName: 'End date' },
  ]

  const animalSpecimenFields = [
    { name: 'ID', type: 'string', columnName: 'ID' },
    { name: 'Experiment_flat', type: 'string', columnName: 'Experiment' },
    { name: 'Treatment_flat', type: 'string', columnName: 'Treatment' },
    { name: 'TreatmentName', type: 'array', columnName: 'Treatment name' },
    { name: 'Pen', type: 'string', columnName: 'Pen' },
    { name: 'SlaughteringDayCount', type: 'number', columnName: 'Slaughtering day count' },
    { name: 'SlaughteringDate', type: 'string', columnName: 'Slaughtering date' },
    { name: 'Weight', type: 'number', columnName: 'weight' },
  ]

  const intestinalSectionSampleFields = [
    { name: 'ID', type: 'string', columnName: 'ID' },
    { name: 'Individual', type: 'string', columnName: 'Experimental unit series' },
    { name: 'Code', type: 'string', columnName: 'Code' },
    { name: 'Type', type: 'string', columnName: 'Type' },
    { name: 'Description', type: 'string', columnName: 'Description' },
    { name: 'Container', type: 'string', columnName: 'Containter' },
    { name: 'Preservative', type: 'string', columnName: 'Preservative' },
  ]

  const cryosectionFields = [
    { name: 'ID', type: 'string', columnName: 'ID' },
    { name: 'Slide_flat', type: 'string', columnName: 'Slide' },
    { name: 'Position', type: 'string', columnName: 'Position' },
    { name: 'SlideDate', type: 'array', columnName: 'Slide date' },
  ]

  const microsampleFields = [
    { name: 'Code', type: 'string', columnName: 'Code' },
    { name: 'LMBatch_flat', type: 'array', columnName: 'LMBatch' },
    { name: 'Cryosection_flat', type: 'string', columnName: 'Cryosection' },
    { name: 'CollectionMethod', type: 'array', columnName: 'Collection method' },
    { name: 'Researcher', type: 'string', columnName: 'Researcher' },
    { name: 'Date', type: 'string', columnName: 'Date' },
    { name: 'Shape', type: 'string', columnName: 'Shape' },
    { name: 'Xcoord', type: 'number', columnName: 'Xcoord' },
    { name: 'Ycoord', type: 'number', columnName: 'Ycoord' },
    { name: 'Size', type: 'number', columnName: 'Size' },
  ]

  const {
    data: animalTrialExperimentData,
    getData: getAnimalTrialExperimentData,
    loading: animalTrialExperimentLoading,
    error: animalTrialExperimentError,
  } = useGlobalSearch({
    keyword,
    AIRTABLE_BASE_ID: animalTrialExperimentBaseId,
    AIRTABLE_TABLE_ID: animalTrialExperimentTableId,
    AIRTABLE_VIEW_ID: animalTrialExperimentViewId,
    fields: animalTrialExperimentFields
  })

  const {
    data: animalSpecimenData,
    getData: getAnimalSpecimenData,
    loading: animalSpecimenLoading,
    error: animalSpecimenError,
  } = useGlobalSearch({
    keyword,
    AIRTABLE_BASE_ID: animalSpecimenBaseId,
    AIRTABLE_TABLE_ID: animalSpecimenTableId,
    AIRTABLE_VIEW_ID: animalSpecimenViewId,
    fields: animalSpecimenFields
  })

  const {
    data: intestinalSectionSampleData,
    getData: getIntestinalSectionSampleData,
    loading: intestinalSectionSampleLoading,
    error: intestinalSectionSampleError,
  } = useGlobalSearch({
    keyword,
    AIRTABLE_BASE_ID: intestinalSectionSampleBaseId,
    AIRTABLE_TABLE_ID: intestinalSectionSampleTableId,
    AIRTABLE_VIEW_ID: intestinalSectionSampleViewId,
    fields: intestinalSectionSampleFields
  })

  const {
    data: cryosectionData,
    getData: getCryosectionData,
    loading: cryosectionLoading,
    error: cryosectionError,
  } = useGlobalSearch({
    keyword,
    AIRTABLE_BASE_ID: cryosectionBaseId,
    AIRTABLE_TABLE_ID: cryosectionTableId,
    AIRTABLE_VIEW_ID: cryosectionViewId,
    fields: cryosectionFields
  })

  const {
    data: microsampleData,
    getData: getMicrosampleData,
    loading: microsampleLoading,
    error: microsampleError,
  } = useGlobalSearch({
    keyword,
    AIRTABLE_BASE_ID: microsampleBaseId,
    AIRTABLE_TABLE_ID: microsampleTableId,
    AIRTABLE_VIEW_ID: microsampleViewId,
    fields: microsampleFields
  })


  return (
    <div className='page_padding min-h-[calc(100vh-var(--navbar-height))]'>
      <header>Search results matching "{keyword}"</header>
      {(animalTrialExperimentLoading || animalSpecimenLoading || intestinalSectionSampleLoading || cryosectionLoading || microsampleLoading)
        && <LoadingRemainingData />
      }
      <main>
        <ResultTable
          title={'Animal Trial/Experiment'}
          data={animalTrialExperimentData}
          fields={animalTrialExperimentFields}
          // loading={animalTrialExperimentLoading}
          error={animalTrialExperimentError}
        />
        <ResultTable
          title={'Animal Specimen'}
          data={animalSpecimenData}
          fields={animalSpecimenFields}
          // loading={animalSpecimenLoading}
          error={animalSpecimenError}
        />
        <ResultTable
          title={'Intestinal Section Sample'}
          data={intestinalSectionSampleData}
          fields={intestinalSectionSampleFields}
          // loading={intestinalSectionSampleLoading}
          error={intestinalSectionSampleError}
        />
        <ResultTable
          title={'Cryosection'}
          data={cryosectionData}
          fields={cryosectionFields}
          // loading={cryosectionLoading}
          error={cryosectionError}
        />
        <ResultTable
          title={'Microsample'}
          data={microsampleData}
          fields={microsampleFields}
          // loading={microsampleLoading}
          error={microsampleError}
        />
      </main>
    </div>
  )
}

export default GlobalSearchResult