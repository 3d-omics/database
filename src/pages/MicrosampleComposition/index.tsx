import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import microsamplesWithCoordinationData from 'assets/data/airtable/microsampleswithcoordination.json'
import useValidateParams from 'hooks/useValidateParams'
import ErrorBanner from 'components/ErrorBanner'
import ImagePlot from './components/ImagePlot'
import TaxonomyChartLegend from 'components/TaxonomyChartLegend'
import TaxonomyChart from './components/TaxonomyChart'
import BreadCrumbs from 'components/BreadCrumbs'
import ParamsValidator from 'components/ParamsValidator'

interface MicrosampleRecord {
  id: string
  createdTime: string
  fields: {
    ID: string
    cryosection_text?: string
    'sample_attribute[Xcoordpixel]'?: number
    'sample_attribute[Ycoordpixel]'?: number
    size?: number
    shape?: string
    [key: string]: any
  }
}

const MicrosampleComposition = () => {

  const { cryosection = '' } = useParams()
  const experimentId = cryosection.charAt(0)

  const [selectedMicrosampleIds, setSelectedMicrosampleIds] = useState<string[]>([])
  const [selectedTaxonomicLevel, setSelectedTaxonomicLevel] = useState('phylum')

  const { validating, notFound } = useValidateParams({
    tableType: 'cryosectionImage',
    filterId: 'ID',
    filterValue: cryosection
  })

  // Filter and extract data in one useMemo
  const coordinationData = useMemo(() => {
    const data = microsamplesWithCoordinationData as MicrosampleRecord[]
    const matchingCryosection = data.filter(
      record => record.fields.cryosection_text === cryosection
    )
    return {
      xcoord: matchingCryosection.map(r => r.fields['sample_attribute[Xcoordpixel]'] || 0),
      ycoord: matchingCryosection.map(r => r.fields['sample_attribute[Ycoordpixel]'] || 0),
      size: matchingCryosection.map(r => r.fields.size || 0),
      shape: matchingCryosection.map(r => r.fields.shape || ''),
      microsampleIds: matchingCryosection.map(r => r.fields.ID),
    }
  }, [cryosection])

  const { xcoord, ycoord, size, shape, microsampleIds } = coordinationData


  return (
    <ParamsValidator validating={validating} notFound={notFound} >
      <div className='px-4 max-w-screen'>

        <section className='pt-4 pb-2 max-xl:pb-6 -mb-6'>
          <BreadCrumbs
            items={[
              { label: 'Home', link: '/' },
              { label: 'Microsample Community Composition', link: '/microsample-composition' },
              { label: cryosection }
            ]}
          />

          <header>
            <span className='font-thin text-xl'>Cryosection:&nbsp;</span>
            <span className='main_header'>{cryosection}</span>
          </header>
        </section>

        <div className='flex min-h-[calc(100vh-123px)] items-start max-xl:flex-col max-xl:gap-12 max-xl:h-fit max-xl:items-center'>

          <div className='w-[35%] aspect-square my-auto max-xl:w-[60%] max-lg:w-[70%] max-md:w-[80%] max-sm:w-[100%] image-plot'>
            <ImagePlot
              cryosection={cryosection}
              setSelectedMicrosampleIds={setSelectedMicrosampleIds}
              microsampleIds={microsampleIds}
              xcoord={xcoord}
              ycoord={ycoord}
              size={size}
              shape={shape}
            />
          </div>

          <div className='w-[65%] flex max-xl:w-full max-xl:pb-8 max-md:flex-col max-md:gap-12'>
            <TaxonomyChart
              cryosection={cryosection}
              microsampleIds={selectedMicrosampleIds.length > 0 ? selectedMicrosampleIds : microsampleIds}
              selectedTaxonomicLevel={selectedTaxonomicLevel}
              setSelectedTaxonomicLevel={setSelectedTaxonomicLevel}
              experimentId={experimentId}
            />
            <TaxonomyChartLegend
              selectedTaxonomicLevel={selectedTaxonomicLevel}
              experimentId={experimentId}
            />
          </div>

        </div>

      </div>
    </ParamsValidator>)
}

export default MicrosampleComposition




