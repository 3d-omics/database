import { Link, useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import SummaryStrip from 'components/SummaryStrip'
import EnaRunMetadata from 'components/EnaRunMetadata'
import SampleTaxonomyOverview from 'components/SampleTaxonomyOverview'
import { TrailMark } from 'components/BreadCrumbs'
import NotFound from 'pages/NotFound'
import microsampleData from 'assets/data/airtable/microsample.json'
import sequencingData from 'assets/data/airtable/microsampleswithcoordination.json'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
import specimenData from 'assets/data/airtable/animalspecimen.json'
import trialData from 'assets/data/airtable/animaltrialexperiment.json'

const MicrosampleOverview = () => {
  const { microsampleCode = '' } = useParams()
  const microsample = microsampleData.find((record) => record.fields.Code.toLowerCase() === microsampleCode.toLowerCase())
  if (!microsample) return <NotFound />

  const fields = microsample.fields
  const accession = fields['ENA accession'] ?? []
  const accessions = Array.isArray(accession) ? accession : [accession]
  const countSampleId = sequencingData.find((record) =>
    record.fields.run_accession && accessions.includes(record.fields.run_accession)
  )?.fields.ID
  const cryosection = cryosectionData.find((record) => record.fields.ID === fields.Cryosection_flat)
  const macrosample = macrosampleData.find((record) => record.fields.ID === cryosection?.fields.Macrosample)
  const specimen = specimenData.find((record) => record.fields.ID === macrosample?.fields.Individual)
  const experimentId = specimen?.fields.Experiment_flat ?? fields.Code.charAt(0)
  const trial = trialData.find((record) => record.fields.ID === experimentId)

  return <div className='min-h-screen'>
    <PageHeader
      title={fields.Code}
      breadcrumbs={[
        { label: 'Data Portal Home', link: '/' },
        { label: 'Microsamples', link: '/microsamples' },
        { label: fields.Code },
      ]}
      aside={accessions.length > 0 && <dl className='grid grid-cols-[auto_1fr] gap-x-2 rounded-md bg-black/20 px-3 py-1.5 text-sm text-neutral-50/85 [&_a]:font-bold hover:[&_a]:text-light_mustard'>
        <dt className='flex items-center gap-2'><TrailMark />ENA accession:</dt>
        <dd>{fields['ENA link']
          ? <Link to={fields['ENA link']} target='_blank' rel='noopener noreferrer'>{accessions.join(', ')}</Link>
          : accessions.join(', ')}</dd>
      </dl>}
    >
      <p>A laser-microdissected sample from a cryosection. Its location and genome profile link this sample to the spatial view of its parent section.</p>
    </PageHeader>

    <SummaryStrip label='Microsample summary' stats={[
      { label: 'Trial', value: trial?.fields.ID, to: trial && `/animal-trials/${encodeURIComponent(trial.fields.Name)}`, title: trial?.fields.Name },
      { label: 'Cryosection', value: fields.Cryosection_flat, to: cryosection && `/cryosections/${encodeURIComponent(cryosection.fields.ID)}` },
      { label: 'Macrosample', value: macrosample?.fields.ID, to: macrosample && `/macrosamples/${encodeURIComponent(macrosample.fields.ID)}` },
      { label: 'Size', value: fields.Size != null ? `${fields.Size.toLocaleString('en-US')} µm²` : undefined },
    ]} />

    <main className='page_padding grid gap-x-10 gap-y-9 pt-9 pb-12 xl:grid-cols-2'>
      {accessions.length > 0 && <EnaRunMetadata accessions={accessions} />}
      <div className={`space-y-9 ${accessions.length === 0 ? 'xl:col-span-2' : ''}`}>
        <section>
          <h2 className='main_header text-2xl text-ink'>Sample details</h2>
          <dl className='mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2'>
            <div><dt className='text-sm text-ink_muted'>Animal specimen</dt><dd className='mt-1 font-semibold text-ink'>{specimen ? <Link className='link' to={`/animal-specimens/${encodeURIComponent(specimen.fields.ID)}`}>{specimen.fields.ID}</Link> : '—'}</dd></div>
            <div><dt className='text-sm text-ink_muted'>Microdissection batch</dt><dd className='mt-1 font-semibold text-ink'>{fields.LMBatch_flat ?? '—'}</dd></div>
            <div><dt className='text-sm text-ink_muted'>X coordinate</dt><dd className='mt-1 font-semibold text-ink'>{fields.Xcoord != null ? `${fields.Xcoord} µm` : '—'}</dd></div>
            <div><dt className='text-sm text-ink_muted'>Y coordinate</dt><dd className='mt-1 font-semibold text-ink'>{fields.Ycoord != null ? `${fields.Ycoord} µm` : '—'}</dd></div>
          </dl>
        </section>
        {countSampleId && <SampleTaxonomyOverview kind='micro' experimentId={experimentId} sampleId={countSampleId} cryosection={fields.Cryosection_flat} />}
      </div>
    </main>
  </div>
}

export default MicrosampleOverview
