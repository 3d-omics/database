import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import SummaryStrip from 'components/SummaryStrip'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import MicrosampleComposition from './MicrosampleComposition'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
import specimenData from 'assets/data/airtable/animalspecimen.json'
import trialData from 'assets/data/airtable/animaltrialexperiment.json'

const CryosectionOverview = () => {

  const { cryosectionName = '' } = useParams()

  // Validate that the cryosection exists
  const { validating, notFound } = useValidateParams({
    tableType: 'cryosection',
    filterId: 'ID',
    filterValue: cryosectionName
  })

  // Filter data to find the specific cryosection
  const data = useMemo(() => {
    return (cryosectionData).filter((record) => {
      const name = record.fields.ID
      return name && String(name).toLowerCase() === cryosectionName.toLowerCase()
    })
  }, [cryosectionName])


  // Check if community composition data exists for this cryosection
  const hasCommunityComposition = useMemo(() => {
    return cryosectionImageData.some((record) => {
      const name = record.fields.ID
      return name && name === cryosectionName
    })
  }, [cryosectionName])

  const cryosection = data[0]
  const slideCryosections = useMemo(() => {
    const slide = cryosection?.fields.Slide_flat
    if (!slide) return []

    return cryosectionData
      .filter((record) => record.fields.Slide_flat === slide)
      .sort((a, b) => a.fields.Position.localeCompare(b.fields.Position) || a.fields.ID.localeCompare(b.fields.ID))
  }, [cryosection])
  const macrosample = macrosampleData.find((record) => record.fields.ID === cryosection?.fields.Macrosample)
  const specimen = specimenData.find((record) => record.fields.ID === macrosample?.fields.Individual)
  const trial = trialData.find((record) => record.fields.ID === specimen?.fields.Experiment_flat)
  const slideSwitcher = cryosection && slideCryosections.length > 1 ? (
    <nav aria-label={`Cryosections on slide ${cryosection.fields.Slide_flat}`} className='flex flex-wrap items-center justify-end gap-x-3 gap-y-2 max-lg:justify-start'>
      <span className='whitespace-nowrap text-sm font-jakarta font-semibold text-ink'>Slide {cryosection.fields.Slide_flat}</span>
      <div className='inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-line bg-surface_muted p-1'>
        {slideCryosections.map((section) => {
          const current = section.fields.ID === cryosection.fields.ID
          return (
            <Link
              key={section.fields.ID}
              to={`/cryosections/${encodeURIComponent(section.fields.ID)}`}
              aria-current={current ? 'page' : undefined}
              title={`Position ${section.fields.Position}`}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 font-jakarta font-semibold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy_ink ${current
                ? 'bg-burgundy text-white shadow-sm'
                : 'text-ink_muted hover:bg-surface hover:text-burgundy_ink'}`}
            >
              {section.fields.ID}
            </Link>
          )
        })}
      </div>
    </nav>
  ) : null

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {cryosection && (
          <>
            <PageHeader
              title={cryosectionName}
              breadcrumbs={[
                { label: 'Data Portal Home', link: '/' },
                { label: 'Cryosections', link: '/cryosections' },
                { label: cryosectionName }
              ]}
            >
              <p>
                A cryosection is a thin cross-cut of the intestine, holding both the host's
                tissue and the intestinal contents. Its microsamples are cut from it by laser
                capture microdissection: each covers about 50,000 µm³, usually 100 to 2,000
                bacterial cells, and keeps its position on the section, so the microbial
                community can be mapped across it.
              </p>
            </PageHeader>

            <SummaryStrip
              label='Cryosection summary'
              stats={[
                { label: 'Trial', value: trial?.fields.ID, to: trial && `/animal-trials/${encodeURIComponent(trial.fields.Name)}`, title: trial?.fields.Name },
                { label: 'Specimen', value: specimen?.fields.ID, to: specimen && `/animal-specimens/${encodeURIComponent(specimen.fields.ID)}` },
                { label: 'Macrosample', value: cryosection.fields.Macrosample, to: `/macrosamples/${encodeURIComponent(cryosection.fields.Macrosample)}` },
                { label: 'Number of microsamples', value: cryosection.fields['Microsample number'] },
              ]}
            />

            {/* The composition, where there is one, then the microsamples it is drawn
                from; the header introduces microsamples, so the table does not */}
            <main>
              {hasCommunityComposition
                ? <MicrosampleComposition cryosection={cryosection.fields.ID} slideSwitcher={slideSwitcher} />
                : slideSwitcher && <div className='page_padding !pb-0'>{slideSwitcher}</div>
              }
              <MicrosampleTab id={cryosection.fields.ID} displayTableDescription={false} />
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default CryosectionOverview
