import { useState, useEffect } from 'react'

const SignificantMetabolitesTable = ({ calculatedData, pValueThreshold, foldChangeThreshold, executeCreatePlot }: {
  calculatedData: {
    metabolite: string
    fold_change: number
    p_value: number
    significant: boolean
  }[] | null
  pValueThreshold: number
  foldChangeThreshold: number
  executeCreatePlot: boolean
}) => {

  const [displayedRows, setDisplayedRows] = useState<number>(30)

  // To reset the number of displayed rows when the data changes
  useEffect(() => {
    setDisplayedRows(30)
  }, [executeCreatePlot])


  return (
    <>
      {calculatedData &&
        <div className='overflow-auto h-full w-[500px] border rounded-lg
        max-xl:w-full max-xl:mb-4
      '>
          <table className='text-xs w-full max-sm:text-2xs' data-testid='significant-metabolites-table'>
            <thead className='sticky top-0 bg-neutral-100 shadow-lg [&_th]:px-4 [&_th]:py-3 max-sm:[&_th]:px-2'>
              <tr className='whitespace-nowrap'>
                <th>Metabolite</th>
                <th>Fold Change</th>
                <th>P-Value</th>
                <th>Significant</th>
              </tr>
            </thead>
            <tbody className='bg-neutral-50 odd:[&>tr]:bg-neutral-200 hover:[&>tr]:bg-light_burgundy hover:[&>tr]:text-white
              [&_td]:px-4 [&_td]:py-1 max-sm:[&_td]:px-2
            '>
              {calculatedData ? (
                calculatedData
                  .filter(d => d.p_value > -Math.log10(pValueThreshold))
                  .sort((a, b) => Math.abs(b.fold_change) - Math.abs(a.fold_change))
                  .slice(0, displayedRows)
                  .map((d, i) => (
                    <tr key={i}>
                      <td className="">{d.metabolite}</td>
                      <td className="!max-w-4">{d.fold_change.toFixed(2)}</td>
                      <td className="!max-w-4">{d.p_value.toFixed(2)}</td>
                      <td className="text-center">
                        {d.p_value > -Math.log10(pValueThreshold) && Math.abs(d.fold_change) > foldChangeThreshold ?
                          <span className="px-2 py-0.5 rounded-full bg-light_mustard text-gray-800">Yes</span> :
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">No</span>
                        }
                      </td>
                    </tr>
                  ))
              ) : (
                Array.from({ length: 25 }).map((_, i) => (
                  <tr key={i}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>



          {(calculatedData && calculatedData.length > displayedRows) &&
            <div className="m-3 w-fit mx-auto">
              <button
                className="font-extrabold text-lg text-burgundy hover:text-burgundy/70"
                // className="btn btn-sm bg-burgundy text-white border-none"
                onClick={() => setDisplayedRows(displayedRows + 10)}
              >
                Load more
              </button>
            </div>
          }

        </div>
      }
    </>
  )
}

export default SignificantMetabolitesTable