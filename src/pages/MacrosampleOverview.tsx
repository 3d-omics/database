import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import macrosampleData from 'assets/data/airtable/intestinalsectionsample.json'
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
            >
              <div className='flex gap-7 max-lg:flex-col max-lg:gap-0.5'>
                <div className='flex flex-col gap-0.5'>
                  <span>
                    Animal Specimen:&nbsp;
                    <b>{macrosample.fields.Individual}</b>
                  </span>
                  <span>
                    Code:&nbsp;
                    <b>{macrosample.fields.Code}</b>
                  </span>
                  <span>
                    Sample type:&nbsp;
                    <b>{macrosample.fields['Sample type']}</b>
                  </span>
                </div>

                <div className='flex flex-col gap-0.5'>
                  <span>
                    Data type:&nbsp;
                    <b>{macrosample.fields['Data type']}</b>
                  </span>
                  <span>
                    Description:&nbsp;
                    <b>{macrosample.fields.Description}</b>
                  </span>
                  <span>
                    Container:&nbsp;
                    <b>{macrosample.fields.Container}</b>
                  </span>
                </div>

                <div className='flex flex-col gap-0.5'>
                  <span>
                    Preservative:&nbsp;
                    <b>{macrosample.fields.Preservative}</b>
                  </span>
                  <span>
                    Weight:&nbsp;
                    <b>{macrosample.fields.Weight}</b>
                  </span>
                  <span>
                    ENA Accession:&nbsp;
                    <Link to={macrosample.fields['ENA link']} target='_blank' rel='noopener noreferrer' className='link'><b>{macrosample.fields['ENA accession']}</b></Link>
                  </span>
                </div>
              </div>
            </PageHeader>

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