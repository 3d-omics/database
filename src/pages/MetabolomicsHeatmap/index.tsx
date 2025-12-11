import { useState, useEffect, useMemo } from 'react'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import BreadCrumbs from 'components/BreadCrumbs'
import { useParams } from 'react-router-dom'
import Macrosample from 'pages/Macrosamples'
// import useMetaboliteExcelFileData from 'hooks/useMetaboliteExcelFileData'
import { macrosampleWithMetaboliteData as listOfMacrosampleWithMetaboliteData } from 'config/macrosampleWithMetaboliteData'
// import Loading from 'components/Loading'
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

  const macrosampleWithMetaboliteData = useMemo(() => {
    return listOfMacrosampleWithMetaboliteData.filter(id => id.startsWith(experimentId))
  }, [experimentId])

  // const { listOfSampleIdsThatHaveMetaboliteData } = useMetaboliteExcelFileData({ experimentId })

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
        macrosampleWithMetaboliteData={macrosampleWithMetaboliteData}
        displayTableDescription={true}
        pageTitle={'Sample selection for heatmap'}
        tableDescription={`Below are the macrosamples available for the ${experimentName} experiment that have metabolite data. Select the macrosamples you wish to include in the heatmap.`}
        checkedMetaboliteIds={checkedMetaboliteIds}
        setCheckedMetaboliteIds={setCheckedMetaboliteIds}
      />

      {/* {
        listOfSampleIdsThatHaveMetaboliteData.length === 0
          ? <div className='min-h-dvh'><Loading /></div>
          : <Macrosample
            filterWith={[{ id: 'ID', value: experimentId, condition: 'startsWith' }]}
            macrosampleWithMetaboliteData={listOfSampleIdsThatHaveMetaboliteData}
            displayTableDescription={true}
            pageTitle={'Sample selection for heatmap'}
            tableDescription={`Below are the macrosamples available for the ${experimentName} experiment that have metabolite data. Select the macrosamples you wish to include in the heatmap.`}
          />
      } */}

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