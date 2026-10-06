import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import SummaryStrip from 'components/SummaryStrip'
import { TrailMark } from 'components/BreadCrumbs'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
import specimenData from 'assets/data/airtable/animalspecimen.json'
import CryosectionTab from 'components/TabComponents/CryosectionTab'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import Tabs from 'components/Tabs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'

const MacrosampleOverview = () => {

  const { macrosampleName = '' } = useParams()
  const [selectedTab, setSelectedTab] = useState('Cryosections')

  // Validate that the macrosample exists
  const { validating, notFound } = useValidateParams({
    tableType: 'macrosample',
    filterId: 'ID',
    filterValue: macrosampleName
  })

  // Filter data to find the specific macrosample
  const data = useMemo(() => {
    return (macrosampleData).filter((record) => {
      const name = record.fields.ID
      return name && String(name).toLowerCase() === macrosampleName.toLowerCase()
    })
  }, [macrosampleName])

  const macrosample = data[0]
  const specimen = specimenData.find((record) => record.fields.ID === macrosample?.fields.Individual)
  // The first character of a macrosample ID identifies its experiment, including
  // the few records whose parent specimen is absent from the catalogue.
  const experiment = specimen?.fields.Experiment_flat ?? macrosample?.fields.ID.charAt(0)
  const enaAccession = macrosample?.fields['ENA accession']?.join(', ')

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {macrosample && (
          <>
            <PageHeader
              title={macrosampleName}
              breadcrumbs={[
                { label: 'Data Portal Home', link: '/' },
                { label: 'Macrosamples', link: '/macrosamples' },
                { label: macrosampleName }
              ]}
              aside={enaAccession &&
                <dl className='grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 rounded-md bg-black/20 px-3 py-1.5 text-sm text-neutral-50/85 backdrop-blur-sm [&_dt]:flex [&_dt]:items-center [&_dt]:gap-2 [&_a]:font-bold [&_a]:transition-colors hover:[&_a]:text-light_mustard'>
                  <dt><TrailMark />ENA accession:</dt>
                  <dd>
                    {macrosample.fields['ENA link']
                      ? <Link to={macrosample.fields['ENA link']} target='_blank' rel='noopener noreferrer'>
                        {enaAccession}
                      </Link>
                      : enaAccession}
                  </dd>
                </dl>
              }
            />

            <SummaryStrip
              label='Macrosample summary'
              stats={[
                { label: 'Experiment', value: experiment },
                { label: 'Sample type', value: macrosample.fields['Sample type'] },
                { label: 'Destination', value: macrosample.fields['Data type'] },
                { label: 'Preservation', value: macrosample.fields.Preservative },
              ]}
            />

            <section className='page_padding'>
              <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={['Cryosections', 'Microsamples']}
              />
            </section>

            <main className='-mt-7'>
              {selectedTab === 'Cryosections' && <CryosectionTab id={macrosample.fields.ID} />}
              {selectedTab === 'Microsamples' && <MicrosampleTab id={macrosample.fields.ID} />}
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default MacrosampleOverview
