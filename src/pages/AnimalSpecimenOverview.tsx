import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import animalSpecimenData from 'assets/data/airtable/animalspecimen.json'
import MacrosampleTab from 'components/MacrosampleTab'
import MicrosampleTab from 'components/MicrosampleTab'
import Tabs from 'components/Tabs'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'

const AnimalSpecimenOverview = () => {

  const { specimenName = '' } = useParams()
  const [selectedTab, setSelectedTab] = useState('Macrosample')

  // Validate that the specimen exists
  const { validating, notFound } = useValidateParams({
    tableType: 'animalSpecimen',
    filterId: 'ID',
    filterValue: specimenName
  })

  // Filter data to find the specific specimen
  const data = useMemo(() => {
    return (animalSpecimenData).filter((record) => {
      const name = record.fields.ID
      return name && String(name).toLowerCase() === specimenName.toLowerCase()
    })
  }, [specimenName])

  const specimen = data[0]

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='min-h-screen'>
        {specimen && (
          <>
            <section className='page_padding'>
              <BreadCrumbs
                items={[
                  { label: 'Home', link: '/' },
                  { label: 'Animal Specimen', link: '/animal-specimen' },
                  { label: specimenName }
                ]}
              />

              <header className='main_header mb-3'>{specimenName}</header>

              <div className='flex gap-7 text-sm text-gray-500 pb-8 font-thin [&>span]:flex [&>span]:gap-1'>
                <div className='flex flex-col gap-0.5'>
                  <span>
                    Experiment ID:&nbsp;
                    <b>{specimen.fields.ID}</b>
                  </span>
                  <span>
                    Experiment:&nbsp;
                    <b>{specimen.fields.Experiment_flat}</b>
                  </span>
                  <span>
                    Treatment:&nbsp;
                    <b>{specimen.fields.Treatment_flat}</b>
                  </span>
                </div>

                <div className='flex flex-col gap-0.5'>
                  <span>
                    Treatment Name:&nbsp;
                    <b>{specimen.fields.TreatmentName}</b>
                  </span>
                  <span>
                    Pen:&nbsp;
                    <b>{specimen.fields.Pen}</b>
                  </span>
                  <span>
                    Slaughtering Day Count:&nbsp;
                    <b>{specimen.fields.SlaughteringDayCount}</b>
                  </span>
                </div>

                <div className='flex flex-col gap-0.5'>
                  <span>
                    SlaughteringDate:&nbsp;
                    <b>{specimen.fields.SlaughteringDate}</b>
                  </span>
                  <span>
                    Weight:&nbsp;
                    <b>{specimen.fields.Weight}</b>
                  </span>
                  <span>
                    Biosample Accession:&nbsp;
                    <Link to={specimen.fields['Biosample link']} target="_blank" rel="noopener noreferrer" className='link'><b>{specimen.fields['Biosample accession']}</b></Link>
                  </span>
                </div>
              </div>

              <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={['Macrosample', 'Microsample']}
              />
            </section>


            <main className='-mt-7'>
              {selectedTab === 'Macrosample' && <MacrosampleTab id={specimen.fields.ID} />}
              {selectedTab === 'Microsample' && <MicrosampleTab id={specimen.fields.ID} />}
            </main>
          </>
        )}
      </div>
    </ParamsValidator>
  )
}

export default AnimalSpecimenOverview