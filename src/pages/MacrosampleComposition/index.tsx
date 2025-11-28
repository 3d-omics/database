import { useState } from 'react'
import TaxonomyChart from './components/TaxonomyChart'
import TaxonomyChartLegend from 'components/TaxonomyChartLegend'
import BreadCrumbs from 'components/BreadCrumbs'
import { useParams } from 'react-router-dom'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import ErrorBanner from 'components/ErrorBanner'

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
      <div className='px-8 max-w-screen'>

        <section className='pt-4 pb-12 max-xl:pb-6 -mb-6'>
          <BreadCrumbs
            items={[
              { label: 'Home', link: '/' },
              { label: 'Macrosamples Community Composition', link: '/macrosample-composition' },
              { label: experimentName },
            ]}
          />
          <header className='main_header mb-4'>Macrosample Community Composition: {experimentName}</header>
        </section>

        <div className='flex min-h-[calc(100vh-300px)] justify-between gap-10 items-start
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