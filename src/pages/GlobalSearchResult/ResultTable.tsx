import { useState } from 'react'
import LoadingRemainingData from 'components/LoadingRemainingData'
import Loading from 'components/Loading'
import ErrorBanner from 'components/ErrorBanner'

const ResultTable = ({ title, data, fields, error }: { title: string, data: any[] | null, fields: { name: string, type: string, columnName: string }[], error: null | string }) => {

  const [displayedData, setDisplayedData] = useState(10)

  return (
    <div>
      {error && <div className='py-6 border-b-2'>
        <header className='flex items-center gap-1'>
          <h1>
            Matching&nbsp;
            <span className='font-bold'>{title}</span>
          </h1>
          <p className='font-bold'>{data && <>({data.length})</>}</p>
        </header>
        <ErrorBanner>{error}</ErrorBanner>
      </div>
      }
      {data &&
        <div className='border-b-2 py-6'>
          <header className='flex items-center gap-1'>
            <h1>
              Matching&nbsp;
              <span className='font-bold'>{title}</span>
            </h1>
            <p className='font-bold'>({data.length})</p>
          </header>
          {data.length > 0 &&
            <div>
              <table className='w-full text-xs mt-4 table table-xs'>
                <thead className='shadow-sm'>
                  <tr className='[&>th]:mr-2'>
                    {fields.map((field, i) => (
                      <th key={i}>{field.columnName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className='odd:[&>tr]:bg-neutral-100'>
                  {data.slice(0, displayedData).map((d, rowIndex) => (
                    <tr className='' key={rowIndex}>
                      {fields.map((field, colIndex) => (
                        <td key={colIndex}>{d.fields[field.name]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > displayedData &&
                <div className='mt-6 flex justify-center'>
                  <button
                    className="btn btn-sm"
                    onClick={() => setDisplayedData(displayedData + 10)}
                  >
                    see more
                  </button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  )
}

export default ResultTable
