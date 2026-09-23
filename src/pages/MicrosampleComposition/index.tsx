import { useState, useMemo, useCallback } from 'react'
import microsamplesWithCoordinationData from 'assets/data/airtable/microsampleswithcoordination.json'
import useValidateParams from 'hooks/useValidateParams'
import ImagePlot from './components/ImagePlot'
import TaxonomyChartLegend from 'components/TaxonomyChartLegend'
import TaxonomyChart from './components/TaxonomyChart'
import TaxonomicLevelPicker from './components/TaxonomicLevelPicker'
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

const MicrosampleComposition = ({ cryosection = '' }) => {

  const experimentId = cryosection.charAt(0)

  const [selectedMicrosampleIds, setSelectedMicrosampleIds] = useState<string[]>([])
  const [selectedTaxonomicLevel, setSelectedTaxonomicLevel] = useState('phylum')
  const [isChangingLevel, setIsChangingLevel] = useState(false)

  // The chart is covered while it is redrawn at the new level: the change waits a
  // tick so the cover is painted first, and the cover lifts once the chart has redrawn
  const handleLevelChange = useCallback((level: string) => {
    setIsChangingLevel(true)
    setTimeout(() => {
      setSelectedTaxonomicLevel(level)
      setTimeout(() => setIsChangingLevel(false), 100)
    }, 0)
  }, [])

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
      <section aria-labelledby='composition-heading' className='page_padding'>
        {/* The heading carries the line on how to read the pair, so the tools in the
            image's left rail are met already explained */}
        <div className='flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-5'>
          <div>
            <h2 id='composition-heading' className='main_header'>Metagenomics</h2>
            <p className='mt-1 text-sm text-ink_muted max-w-2xl'>
              Click a microsample on the section for its own community, or take the
              selection tool from the rail on the left and draw a box around several.
              Until then the chart holds every microsample on the section.
            </p>
          </div>
          <TaxonomicLevelPicker
            selectedTaxonomicLevel={selectedTaxonomicLevel}
            onChange={handleLevelChange}
            disabled={isChangingLevel}
          />
        </div>

        {/* The square image sets the row's height and the chart takes it on, so the
            two stand level. The chart is laid over its column rather than inside it,
            so that it cannot hold the row open when the image shrinks. Below lg the
            chart goes under the image at a height of its own. The image's column is a flex
            box so that the plot, an inline block, leaves no line gap below itself */}
        <div className='flex gap-6 max-lg:flex-col'>
          <div className='flex w-[min(70vh,45%)] aspect-square shrink-0 max-lg:w-full max-lg:max-w-xl max-lg:self-center'>
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

          <div className='relative flex-1 min-w-0 max-lg:flex-none max-lg:h-[28rem]'>
            <div className='absolute inset-0'>
              <TaxonomyChart
                cryosection={cryosection}
                microsampleIds={selectedMicrosampleIds.length > 0 ? selectedMicrosampleIds : microsampleIds}
                selectedTaxonomicLevel={selectedTaxonomicLevel}
                isChangingLevel={isChangingLevel}
                experimentId={experimentId}
              />
            </div>
          </div>
        </div>

        <div className='mt-4'>
          <TaxonomyChartLegend
            selectedTaxonomicLevel={selectedTaxonomicLevel}
            experimentId={experimentId}
            layout='row'
          />
        </div>
      </section>
    </ParamsValidator>
  )
}

export default MicrosampleComposition


