import { useState, useEffect } from 'react'
import VolcanoPlot from './components/VolcanoPlot'
import { useParams } from 'react-router-dom'
import AnalysisSettings from './components/AnalysisSetting'
import SignificantMetabolitesTable from './components/SignificantMetabolitesTable'
import useValidateParams from 'hooks/useValidateParams'
import ParamsValidator from 'components/ParamsValidator'
import BreadCrumbs from 'components/BreadCrumbs'


const Metabolomics = () => {

  const { experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const { validating, notFound } = useValidateParams({
    tableType: 'metabolomics',
    filterId: 'Name',
    filterValue: experimentName
  })

  const options: Record<string, Record<string, string>> =
    experimentId === 'I' // Swine experiment
      ? {
        Diet: {
          '1': 'High protein diet',
          '3': 'Low protein diet',
          T1: 'Control diet + no mannan',
          T2: 'Mannan'
        },
        Group: {
          LEBV: 'LEBV',
          HEBV: 'HEBV'
        }
      }
      : experimentId === 'G' // Salmonella experiment
        ? {
          Treatment: {
            T1: 'YES pathogen, YES PoultryStar® in drinking water and feed',
            T2: 'YES pathogen, YES PoultryStar® in drinking water',
            T3: 'YES pathogen, YES PoultryStar® in feed',
            T4: 'YES pathogen, NO PoultryStar®',
            T5: 'NO pathogen, NO PoultryStar®'
          }
        }
        : {}



  const [compareBetween, setCompareBetween] = useState<string>(options ? Object.keys(options)[0] : '')
  const [group1, setGroup1] = useState<string>(
    options ? Object.keys(Object.values(options)[0] as Record<string, string>)[0] : ''
  )
  const [group2, setGroup2] = useState<string>(
    options ? Object.keys(Object.values(options)[0] as Record<string, string>)[1] : ''
  )
  // console.log(experimentId, '===>', compareBetween, ':', group1, group2)
  const [executeCreatePlot, setExecuteCreatePlot] = useState<boolean>(false)
  const [calculatedData, setCalculatedData] = useState<{ metabolite: string, fold_change: number, p_value: number, significant: boolean }[] | null>(null)
  const [pValueThreshold, setPValueThreshold] = useState(0.05)
  const [foldChangeThreshold, setFoldChangeThreshold] = useState(1.5)

  return (
    <ParamsValidator validating={validating} notFound={notFound}>
      <div className='px-4 pt-4 pb-4 flex flex-col overflow-auto'>

        <BreadCrumbs
          items={[
            { label: 'Data Portal Home', link: '/' },
            { label: 'Metabolomics', link: '/metabolomics' },
            { label: experimentName },
          ]}
        />

        <div className='flex items-end gap-3 pb-6'>
          <header className='main_header'>{experimentName}</header>
        </div>

        <main className='rounded-md flex gap-4 bg-white min-h-[calc(100vh-(var(--navbar-height)+70px))] max-h-[calc(100vh-(var(--navbar-height)))]
        max-xl:flex-col max-xl:border-none max-xl:h-full max-xl:max-h-none
      '>

          <div className='h-full grow'>
            <AnalysisSettings
              compareBetween={compareBetween}
              setCompareBetween={setCompareBetween}
              group1={group1}
              setGroup1={setGroup1}
              group2={group2}
              setGroup2={setGroup2}
              setExecuteCreatePlot={setExecuteCreatePlot}
              options={options}
            />
            <VolcanoPlot
              compareBetween={compareBetween}
              group1={group1}
              group2={group2}
              executeCreatePlot={executeCreatePlot}
              setExecuteCreatePlot={setExecuteCreatePlot}
              calculatedData={calculatedData}
              setCalculatedData={setCalculatedData}
              pValueThreshold={pValueThreshold}
              setPValueThreshold={setPValueThreshold}
              foldChangeThreshold={foldChangeThreshold}
              setFoldChangeThreshold={setFoldChangeThreshold}
              experimentId={experimentId}
              options={options}
            />
          </div>

          <div className='max-xl:mx-16 max-lg:mx-0'>
            <SignificantMetabolitesTable
              calculatedData={calculatedData}
              pValueThreshold={pValueThreshold}
              foldChangeThreshold={foldChangeThreshold}
              executeCreatePlot={executeCreatePlot}
            />
          </div>

        </main>

      </div>
    </ParamsValidator>
  )
}

export default Metabolomics
