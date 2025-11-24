import { useState, useEffect, Dispatch, SetStateAction } from 'react'

const AnalysisSettings = ({ compareBetween, setCompareBetween, group1, setGroup1, group2, setGroup2, setExecuteCreatePlot }: {
  compareBetween: string
  setCompareBetween: Dispatch<SetStateAction<string>>
  group1: string
  setGroup1: Dispatch<SetStateAction<string>>
  group2: string
  setGroup2: Dispatch<SetStateAction<string>>
  setExecuteCreatePlot: Dispatch<SetStateAction<boolean>>
}) => {

  const [groupSelectionError, setGroupSelectionError] = useState<boolean>(false)

  const checkGroupSelection = () => {
    if (group1 === group2) {
      setGroupSelectionError(true)
      return
    }
    setGroupSelectionError(false)
    setExecuteCreatePlot(true)
  }

  useEffect(() => {
    setGroupSelectionError(false)
  }, [group1, group2])


  return (
    <div className="p-4 pt-3 bg-gray-100 rounded-lg h-fit
      max-xl:mb-4
    ">
      <div className="flex items-center gap-3 [&_div]:w-full max-sm:flex-col">
        <section className='flex justify-between items-center gap-3 w-full max-sm:flex-col'>
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor='compareBetween'>Compare between:</label>
            <select
              className='btn btn-sm text-left w-full bg-white border-none shadow-none'
              value={compareBetween}
              id='compareBetween'
              onChange={(e) => setCompareBetween(e.target.value)}
            >
              <option value="Diet">Diet</option>
              <option value="Group">Group</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor='group1'>Group 1:</label>
            <select
              className={`btn btn-sm bg-white shadow-none text-left w-full ${groupSelectionError && 'border border-red-500'}`}
              onChange={(e) => setGroup1(e.target.value)}
              value={group1}
              id='group1'
            >
              {
                compareBetween === 'Diet'
                  ?
                  <>
                    <option value="1">High protein diet</option>
                    <option value="3">Low protein diet</option>
                    <option value="T1">Control diet + no mannan</option>
                    <option value="T2">Mannan</option>
                  </>
                  :
                  <>
                    <option value="LEBV">LEBV</option>
                    <option value="HEBV">HEBV</option>
                  </>
              }
            </select>
            {groupSelectionError && <p className='absolute text-red-500 text-xs mt-0.5 ml-1'>Cannot compare between same group</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor='group2'>Group 2:</label>
            <select
              className={`btn btn-sm bg-white shadow-none text-left w-full ${groupSelectionError && 'border border-red-500'}`}
              onChange={(e) => setGroup2(e.target.value)}
              value={group2}
              id='group2'
            >
              {
                compareBetween === 'Diet'
                  ?
                  <>
                    <option value="1">High protein diet</option>
                    <option value="3">Low protein diet</option>
                    <option value="T1">Control diet + no mannan</option>
                    <option value="T2">Mannan</option>
                  </>
                  :
                  <>
                    <option value="LEBV">LEBV</option>
                    <option value="HEBV">HEBV</option>
                  </>
              }
            </select>
            {groupSelectionError && <p className='absolute text-red-500 text-xs mt-0.5 ml-1'>Cannot compare between same group</p>}
          </div>
        </section>

        <div className="!w-fit whitespace-nowrap mt-6 max-sm:flex max-sm:justify-end max-sm:!w-full max-sm:mt-0 mb-2 max-sm:mb-0">
          <button
            className="btn btn-sm bg-burgundy text-white border-burgundy max-sm:mt-3 max-sm:w-full"
            onClick={() => checkGroupSelection()}
          >
            Run Analysis
          </button>
        </div>

      </div>

    </div>
  )
}

export default AnalysisSettings
