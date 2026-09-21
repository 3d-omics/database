import { useMemo } from 'react'
import animalTrialExperimentData from 'assets/data/airtable/animaltrialexperiment.json'
import PageHeader from 'components/PageHeader'
import TrialBlock from 'components/TrialBlock'
import { useGenomeJsonFile } from 'hooks/useJsonData'
import { getCompositionStats } from 'pages/MacrosampleComposition/utils/compositionStats'

// A trial's block, its figures computed from the counts and genome metadata its
// composition chart is drawn from
const CompositionBlock = ({ fields }: { fields: { ID: string, Name: string } }) => {
  const counts = useGenomeJsonFile('macro_genome_counts', `experiment_${fields.ID}_counts`)
  const metadata = useGenomeJsonFile('genome_metadata', `experiment_${fields.ID}_metadata`)
  const stats = useMemo(() => getCompositionStats(counts, metadata), [counts, metadata])

  return <TrialBlock
    fields={fields}
    stats={stats}
    to={`/macrosample-compositions/${encodeURIComponent(fields.Name)}`}
    browseLabel='Browse composition'
  />
}

const MacrosampleCompositionList = () => {

  return (
    <div className='min-h-[calc(100dvh-(var(--navbar-height)+var(--footer-height)))]'>
      <PageHeader
        title='Metagenomics'
        breadcrumbs={[
          { label: 'Data Portal Home', link: '/' },
          { label: 'Macrosamples', link: '/macrosamples' },
          { label: 'Metagenomics' },
        ]}
      >
        <p>
          DNA sequencing reads produced from the macro-scale conventional samples representing each individual animal were mapped against the reference genome catalogue to generate quantitative representations of microbial communities.
        </p>
      </PageHeader>

      <ul className='page_padding flex flex-col gap-4'>
        {animalTrialExperimentData.map((experiment) => (
          <CompositionBlock key={experiment.id} fields={experiment.fields} />
        ))}
      </ul>

    </div>
  )
}

export default MacrosampleCompositionList
