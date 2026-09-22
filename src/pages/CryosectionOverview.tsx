import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import SummaryStrip from 'components/SummaryStrip'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import MicrosampleComposition from './MicrosampleComposition'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'

const CryosectionOverview = () => {

  const { cryosectionName = '' } = useParams()

  // Validate that the macrosample exists
  const { validating, notFound } = useValidateParams({
    tableType: 'cryosection',
    filterId: 'ID',
    filterValue: cryosectionName
  })

  // Filter data to find the specific macrosample
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
                { label: 'Slide', value: cryosection.fields.Slide_flat },
                { label: 'Position', value: cryosection.fields.Position },
                { label: 'Macrosample', value: cryosection.fields.Macrosample },
                { label: 'Number of microsamples', value: cryosection.fields['Microsample number'] },
              ]}
            />

            {/* The composition, where there is one, then the microsamples it is drawn
                from; the header introduces microsamples, so the table does not */}
            <main>
              {hasCommunityComposition && <MicrosampleComposition cryosection={cryosection.fields.ID} />}
              <MicrosampleTab id={cryosection.fields.ID} displayTableDescription={false} />
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default CryosectionOverview