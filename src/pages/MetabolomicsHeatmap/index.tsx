import { useState, useMemo } from 'react'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import BreadCrumbs from 'components/BreadCrumbs'
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
      <div className='page_padding -mb-12'>
        <BreadCrumbs
          items={[
            { label: 'Data Portal Home', link: '/' },
            { label: 'Metabolomics', link: '/metabolomics' },
            { label: `${experimentName} - Heatmap ` },
          ]}
        />
      </div>

      <Macrosample
        filterWith={[{ id: 'ID', value: experimentId, condition: 'startsWith' }]}
        macrosampleWithMetaboliteData={filteredMacrosampleWithMetaboliteData}
        displayTableDescription={true}
        pageTitle={'Sample selection for heatmap'}
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