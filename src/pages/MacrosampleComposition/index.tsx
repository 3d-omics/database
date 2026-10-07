import { useState } from 'react'
import TaxonomyChart from './components/TaxonomyChart'
import TaxonomyChartLegend from 'components/TaxonomyChartLegend'
import PageHeader from 'components/PageHeader'
import { useParams } from 'react-router-dom'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import MacrosampleTab from 'components/TabComponents/MacrosampleTab'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'

const MacrosampleComposition = () => {

  const { experimentName = '' } = useParams()
  const experiment = animalTrialExperimentData.find(
    (record) => record.fields.Name.toLowerCase() === experimentName.toLowerCase()
  )
  const experimentId = experiment?.fields.ID ?? ''

  const [selectedTaxonomicLevel, setSelectedTaxonomicLevel] = useState('phylum')

  const { validating, notFound } = useValidateParams({
    tableType: 'animalTrialExperiment',
    filterId: 'Name',
    filterValue: experimentName
  })

  return (
    <ParamsValidator validating={validating} notFound={notFound} >
      {experiment && <div className='min-h-screen'>
        <PageHeader
          title={experimentName}
          breadcrumbs={[
            { label: 'Data Portal Home', link: '/' },
            { label: 'Macrosamples', link: '/macrosamples' },
            { label: 'Metagenomics', link: '/macrosample-compositions' },
            { label: experimentName },
          ]}
        />

        <main>
          <section aria-labelledby='composition-heading' className='page_padding pt-8'>
            <h2 id='composition-heading' className='main_header mb-5'>Community composition</h2>
            <TaxonomyChart
              experimentId={experimentId}
              selectedTaxonomicLevel={selectedTaxonomicLevel}
              setSelectedTaxonomicLevel={setSelectedTaxonomicLevel}
            />
            <div className='mt-4'>
              <TaxonomyChartLegend
                selectedTaxonomicLevel={selectedTaxonomicLevel}
                experimentId={experimentId}
                layout='row'
              />
            </div>
          </section>
          <MacrosampleTab id={experimentId} />
        </main>
      </div>}
    </ParamsValidator>
  )
}

export default MacrosampleComposition
