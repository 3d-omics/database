import { useState, useEffect, useMemo } from 'react'
import ImagePlot from './components/ImagePlot'
import Legend from './components/Legend'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import TaxonomyGraph from './components/TaxonomyGraph'
import ErrorBanner from 'components/ErrorBanner'
import Guide from './components/Guide'
import { useParams } from 'react-router-dom'
import { airtableConfig } from 'config/airtable'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import microsample_coordination from 'assets/data/microsample_coordination.csv'
import BreadCrumbs from 'components/BreadCrumbs'

const Composition = () => {

  const { cryosection = '' } = useParams()

  const { fetchExcel, fetchExcelError } = useFetchExcelFileData({ excelFile: microsample_coordination })

  const [xcoord, setXcoord] = useState<number[]>([])
  const [ycoord, setYcoord] = useState<number[]>([])
  const [size, setSize] = useState<number[]>([])
  const [shape, setShape] = useState<string[]>([])
  const [microsampleIds, setMicrosampleIds] = useState<string[]>([])
  const [selectedMicrosampleIds, setSelectedMicrosampleIds] = useState<string[]>([])
  const [selectedTaxonomicLevel, setSelectedTaxonomicLevel] = useState('phylum')

  // ================ fetching from csv file =========================

  useEffect(() => {
    fetchExcel().then((columnData: any) => {
      if (columnData) {
        const indices = columnData.cryosection_text
          .map((val: string, i: number) => val === cryosection ? i : -1)
          .filter((i: number) => i !== -1);
        setYcoord(indices.map((i: number) => columnData.Ycoordpixel[i]));
        setXcoord(indices.map((i: number) => columnData.Xcoordpixel[i]));
        setSize(indices.map((i: number) => columnData.size[i]));
        setShape(indices.map((i: number) => columnData.shape[i]));
        setMicrosampleIds(indices.map((i: number) => columnData.ID[i]));
      }
    })
  }, [])

  if (fetchExcelError) {
    return (
      <section className='h-[calc(100vh-var(--navbar-height))] p-12'>
        <ErrorBanner>{fetchExcelError}</ErrorBanner>
      </section>
    )
  }

  // =================== fetching from airtable ==============================

  // const { microsamplesWithCoordinationBaseId, microsamplesWithCoordinationTableId, microsamplesWithCoordinationViewId } = airtableConfig
  // const { first100Data, first100Loading, first100Error, allData, allLoading, allError, } = useGetFirst100Data({
  //   AIRTABLE_BASE_ID: microsamplesWithCoordinationBaseId,
  //   AIRTABLE_TABLE_ID: microsamplesWithCoordinationTableId,
  //   AIRTABLE_VIEW_ID: microsamplesWithCoordinationViewId,
  // })

  // const tempAllData = useMemo(
  //   () => allData.filter((d) => d.fields.cryosection_text === cryosection).map((d) => d.fields),
  //   [allData, cryosection]
  // )

  // useEffect(() => {
  //   if (tempAllData.length > 0) {
  //     setYcoord(tempAllData.map((sample) => sample.Ycoordpixel))
  //     setXcoord(tempAllData.map((sample) => sample.Xcoordpixel))
  //     setSize(tempAllData.map((sample) => sample.size))
  //     setShape(tempAllData.map((sample) => sample.shape))
  //     setMicrosampleIds(tempAllData.map((sample) => sample.ID))
  //   }
  // }, [tempAllData])

  // if (allLoading) { return <div className='loading loading-dots loading-xs min-h-dvh' data-testid='loading' /> }


  //=======================================================================

  return (
    <div className='px-4 max-w-screen'>
      <Guide />

      <section className='pt-4 pb-2 max-xl:pb-6 -mb-6'>
        <BreadCrumbs
          items={[
            { label: 'Home', link: '/' },
            { label: 'Genome Compositions', link: '/composition' },
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
          <TaxonomyGraph
            cryosection={cryosection}
            microsampleIds={selectedMicrosampleIds.length > 0 ? selectedMicrosampleIds : microsampleIds}
            selectedTaxonomicLevel={selectedTaxonomicLevel}
            setSelectedTaxonomicLevel={setSelectedTaxonomicLevel}
          />

          <Legend selectedTaxonomicLevel={selectedTaxonomicLevel} />
        </div>

      </div>

    </div>
  )
}

export default Composition
