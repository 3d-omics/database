import { useState, useEffect } from 'react'
import VolcanoPlot from './components/VolcanoPlot'
import AnalysisSettings from './components/AnalysisSetting'
import SignificantMetabolitesTable from './components/SignificantMetabolitesTable'

const Metabolomics = () => {

  const [compareBetween, setCompareBetween] = useState<string>('Diet')
  const [group1, setGroup1] = useState<string>('1')
  const [group2, setGroup2] = useState<string>('3')
  const [executeCreatePlot, setExecuteCreatePlot] = useState<boolean>(false)
  const [calculatedData, setCalculatedData] = useState<{ metabolite: string, fold_change: number, p_value: number, significant: boolean }[] | null>(null)
  const [pValueThreshold, setPValueThreshold] = useState(0.05)
  const [foldChangeThreshold, setFoldChangeThreshold] = useState(1.5)

  useEffect(() => {
    compareBetween === 'Diet' ? setGroup1('1') : setGroup1('LEBV')
    compareBetween === 'Diet' ? setGroup2('3') : setGroup2('HEBV')
  }, [compareBetween])

  return (
    <div className='px-4 pt-4 pb-4 flex flex-col overflow-auto'>

      <div className='flex items-end gap-3 pb-4'>
        <header className='main_header'>Metabolomics</header>
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
  )
}

export default Metabolomics
