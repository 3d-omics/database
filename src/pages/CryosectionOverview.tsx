import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import cryosectionData from 'assets/data/airtable/cryosection.json'
import MicrosampleTab from 'components/MicrosampleTab'
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
            <section className='page_padding'>
              <BreadCrumbs
                items={[
                  { label: 'Data Portal Home', link: '/' },
                  { label: 'Cryosections', link: '/cryosections' },
                  { label: cryosectionName }
                ]}
              />

              <header className='main_header mb-3'>{cryosectionName}</header>

              <div className='flex gap-4 text-sm text-gray-500 font-thin [&>span]:flex [&>span]:gap-1'>
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

              <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={hasCommunityComposition
                  ? ['Microsamples', 'Microsamples Community Composition']
                  : ['Microsamples']
                }
              />
            </section>


            <main className='-mt-7'>
              {selectedTab === 'Microsamples' && <MicrosampleTab id={cryosection.fields.ID} />}
              {(hasCommunityComposition && selectedTab === 'Microsamples Community Composition')
                && <MicrosampleComposition cryosectionFromTab={cryosection.fields.ID} />
              }
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default CryosectionOverview