import { useState } from 'react'
import TaxonomyChart from './components/TaxonomyChart'
import TaxonomyChartLegend from 'components/TaxonomyChartLegend'
import PageHeader from 'components/PageHeader'
import { useParams } from 'react-router-dom'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'

const MacrosampleComposition = () => {

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const [selectedTaxonomicLevel, setSelectedTaxonomicLevel] = useState('phylum')

  const { validating, notFound } = useValidateParams({
    tableType: 'animalTrialExperiment',
    filterId: 'Name',
    filterValue: experimentName
  })

  return (
    <ParamsValidator validating={validating} notFound={notFound} >
      <div className='max-w-screen'>

        <PageHeader
          title={experimentName}
          breadcrumbs={[
            { label: 'Data Portal Home', link: '/' },
            { label: 'Macrosamples', link: '/macrosamples' },
            { label: 'Metagenomics', link: '/macrosample-compositions' },
            { label: experimentName },
          ]}
        />

        <div className='page_padding flex min-h-[calc(100vh-300px)] justify-between gap-10 items-start
              max-xl:flex-col max-xl:items-start max-xl:gap-12 max-xl:h-fit max-xl:mb-12'>
          <TaxonomyChart
            experimentId={experimentId}
            selectedTaxonomicLevel={selectedTaxonomicLevel}
            setSelectedTaxonomicLevel={setSelectedTaxonomicLevel}
          />
          <TaxonomyChartLegend
            selectedTaxonomicLevel={selectedTaxonomicLevel}
            experimentId={experimentId}
          />
        </div>

      </div>
    </ParamsValidator>
  )
}

export default MacrosampleComposition