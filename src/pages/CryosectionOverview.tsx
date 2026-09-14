import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import MicrosampleTab from 'components/TabComponents/MicrosampleTab'
import Tabs from 'components/Tabs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import MicrosampleComposition from './MicrosampleComposition'
import cryosectionImageData from 'assets/data/airtable/cryosectionimage.json'

const CryosectionOverview = () => {

  const { cryosectionName = '' } = useParams()
  const [selectedTab, setSelectedTab] = useState('Microsamples')

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
              <div className='flex flex-wrap gap-x-4 gap-y-0.5 [&>span]:flex [&>span]:gap-1 max-lg:flex-col'>
                <span>
                  Slide:&nbsp;
                  <b>{cryosection.fields['Slide_flat']}</b>
                </span>
                <span>
                  Position:&nbsp;
                  <b>{cryosection.fields.Position}</b>
                </span>
                <span>
                  Macrosample:&nbsp;
                  <b>{cryosection.fields.Macrosample}</b>
                </span>
                <span>
                  Slide date:&nbsp;
                  <b>{cryosection.fields.SlideDate}</b>
                </span>
                <span>
                  Microsample number:&nbsp;
                  <b>{cryosection.fields['Microsample number']}</b>
                </span>
              </div>
            </PageHeader>

            <section className='page_padding'>
              <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={hasCommunityComposition
                  ? ['Microsamples', 'Metagenomics']
                  : ['Microsamples']
                }
              />
            </section>

            <main className='-mt-7'>
              {selectedTab === 'Microsamples' && <MicrosampleTab id={cryosection.fields.ID} />}
              {(hasCommunityComposition && selectedTab === 'Metagenomics')
                && <MicrosampleComposition cryosection={cryosection.fields.ID} />
              }
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default CryosectionOverview