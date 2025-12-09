import { useState, useEffect, useMemo } from 'react'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import BreadCrumbs from 'components/BreadCrumbs'
import { useParams } from 'react-router-dom'
import Macrosample from 'pages/Macrosamples'
import { macrosampleWithMetaboliteData } from 'config/macrosampleWithMetaboliteData'


const MetabolomicsHeatmap = () => {

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const { validating, notFound } = useValidateParams({
    tableType: 'metabolomics',
    filterId: 'Name',
    filterValue: experimentName
  })

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
        filterWith={[
          { id: 'ID', value: experimentId, condition: 'startsWith' },
          // { id: 'Data type', value: 'Metabolomics' , condition: 'equals' },
        ]}
        macrosampleWithMetaboliteData={macrosampleWithMetaboliteData}
        displayTableDescription={false}
      />

    </ParamsValidator>
  )
}

export default MetabolomicsHeatmap