import { useState, useMemo } from 'react'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import PageHeader from 'components/PageHeader'
import { useParams } from 'react-router-dom'
import Macrosample from 'pages/Macrosamples'
import { macrosampleWithMetaboliteData } from 'config/macrosampleWithMetaboliteData'
import CompareSamplesButton from './components/CompareSamplesButton'

const MetabolomicsHeatmap = () => {

  const [checkedMetaboliteIds, setCheckedMetaboliteIds] = useState<string[]>([])

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)


  const { validating, notFound } = useValidateParams({
    tableType: 'metabolomics',
    filterId: 'Name',
    filterValue: experimentName
  })

  const filteredMacrosampleWithMetaboliteData = useMemo(() => {
    return macrosampleWithMetaboliteData.filter(id => id.startsWith(experimentId))
  }, [experimentId])


  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <PageHeader
        title='Heatmap'
        breadcrumbs={[
          { label: 'Data Portal Home', link: '/' },
          { label: 'Macrosamples', link: '/macrosamples' },
          { label: 'Metabolomics', link: '/metabolomics' },
          { label: experimentName },
          { label: 'Heatmap' },
        ]}
      />

      <Macrosample
        displayPageHeader={false}
        filterWith={[{ id: 'ID', value: experimentId, condition: 'startsWith' }]}
        macrosampleWithMetaboliteData={filteredMacrosampleWithMetaboliteData}
        displayTableDescription={true}
        pageTitle={'Sample Selection for Heatmap'}
        tableDescription={''}
        checkedMetaboliteIds={checkedMetaboliteIds}
        setCheckedMetaboliteIds={setCheckedMetaboliteIds}
        experimentId={experimentId}
      />

      {checkedMetaboliteIds.length > 0 && (
        <CompareSamplesButton
          samples={checkedMetaboliteIds}
          setSamples={setCheckedMetaboliteIds}
        />
      )}
      
    </ParamsValidator>
  )
}

export default MetabolomicsHeatmap