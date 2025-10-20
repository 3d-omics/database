import React, { useState, Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import MetaboliteHeatmapComparison from 'components/MetabolitePlots/Heatmap'
import MetaboliteSpectrum from 'components/MetabolitePlots/Spectrum'
import SingleMetaboliteBarPlot from 'components/MetabolitePlots/Bar'

const CompareSamplesButton = ({ samples, setSamples }: { samples: string[], setSamples: Dispatch<SetStateAction<string[]>> }) => {

  const [displayedPlot, setDisplayedPlot] = useState<string | null>(null)


  return (
    <div>

      <div className='fixed bottom-12 left-0 w-screen z-10 px-12 max-sm:px-2' data-testid='compare-metabolite-samples-button'>
        <main className='bg-blue-950 text-white py-4 px-8 rounded-full flex items-center gap-2 mx-auto w-fit shadow-lg 
        max-lg:px-5 max-lg:py-3 max-lg:text-sm max-sm:px-3 max-sm:py-2'>

          <button onClick={() => setSamples([])} className='mr-3 max-sm:mr-1.5'>
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className='flex items-center gap-1 mr-3  max-sm:mr-1.5'>
            <p className='py-1 px-3 rounded-full bg-blue-700 mr-1 min-w-10 text-center'>{samples.length}</p>
            <span>{samples.length === 1 ? 'sample' : 'samples'}</span>
            selected
          </div>

            {/* ============= spectra =============== */}
            <div
              className={samples.length > 1 ? 'tooltip max-lg:hidden' : ''}
              data-tip='Select only 1 sample to view'
            >
                <button
                className='py-2 px-4 rounded-full bg-blue-800 font-bold flex items-center gap-2 hover:bg-blue-700
                    disabled:bg-blue-800/50 disabled:text-white/50 [&>svg]:disabled:opacity-50'
                disabled={samples.length > 1}
                onClick={() => setDisplayedPlot('spectra')}
                >
                <svg
                  width="24" height="24"
                  viewBox="0 0 100 100"
                  fill="none" xmlns="http://www.w3.org/2000/svg"
                  stroke="white" strokeWidth="2"
                >
                  <line x1="2" y1="92" x2="90" y2="92" stroke="white" strokeWidth="4" />
                  <line x1="4" y1="90" x2="4" y2="10" stroke="white" strokeWidth="4" />
                  {/* ⬇️for line chart⬇️ */}
                  {/* <polyline points="10,80 20,80  30,70   40,80  50,75  60,80  70,20   80,80   90,75" fill="none" stroke="white" strokeWidth="4" /> */}
                  {/* ⬇️for bar chart⬇️ */}
                  <line x1="20" y1="90" x2="20" y2="40" stroke="white" strokeWidth="10" />
                  <line x1="35" y1="90" x2="35" y2="60" stroke="white" strokeWidth="10" />
                  <line x1="50" y1="90" x2="50" y2="30" stroke="white" strokeWidth="10" />
                  <line x1="65" y1="90" x2="65" y2="70" stroke="white" strokeWidth="10" />
                  <line x1="80" y1="90" x2="80" y2="50" stroke="white" strokeWidth="10" />
                </svg>
                <span className="hidden max-sm:inline">View</span>
                <span className="max-sm:hidden">View single sample</span>
                </button>
            </div>

            {/* ============= heatmap =============== */}
            <div
              className={samples.length <= 1 ? 'tooltip max-lg:hidden' : ''}
              data-tip='Select at least 2 samples to compare'
            >
              <button
                className='py-2 px-4 rounded-full bg-blue-800 font-bold flex items-center gap-2 hover:bg-blue-700
                      disabled:bg-blue-800/50 disabled:text-white/50 [&>svg]:disabled:opacity-50'
                disabled={samples.length <= 1}
                onClick={() => setDisplayedPlot('heatmap')}
              >
                <svg
                  width="20" height="20" viewBox="0 0 100 100"
                  fill="none" xmlns="http://www.w3.org/2000/svg"
                  stroke="white" strokeWidth="4"
                >
                  <rect x="0" y="10" width="33" height="20" fill="white" />
                  <rect x="33" y="10" width="33" height="20" fill="none" />
                  <rect x="66" y="10" width="33" height="20" fill="white" />
                  <rect x="0" y="30" width="33" height="20" fill="none" />
                  <rect x="33" y="30" width="33" height="20" fill="none" />
                  <rect x="66" y="30" width="33" height="20" fill="none" />
                  <rect x="0" y="50" width="33" height="20" fill="none" />
                  <rect x="33" y="50" width="33" height="20" fill="none" />
                  <rect x="66" y="50" width="33" height="20" fill="white" />
                  <rect x="0" y="70" width="33" height="20" fill="none" />
                  <rect x="33" y="70" width="33" height="20" fill="white" />
                  <rect x="66" y="70" width="33" height="20" fill="none" />
                </svg>
                <span className="hidden max-sm:inline">View</span>
                <span className="max-sm:hidden">Compare samples in Heatmap</span>
              </button>
            </div>

        </main>
      </div>


      {displayedPlot &&
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
          <dialog open className="modal">
            <div className="modal-box px-0 max-w-[calc(100vw-96px)] relative mx-12">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={(e) => { setDisplayedPlot(null); e.stopPropagation() }}
              >✕</button>
              <h3 className="font-semibold text-xl mb-4 px-6">
                <span className='mr-1 font-light text-sm'>
                  {displayedPlot === 'spectra'
                    ? 'Single feature of:'
                    : 'Heatmap comparison of: '
                  }
                </span>
                {samples.map((sample) => <span key={sample} className='mr-2'>{sample}</span>)}
              </h3>

              <main className='overflow-auto'>
                {displayedPlot === 'spectra' && <SingleMetaboliteBarPlot id={samples} />}
                {displayedPlot === 'spectra' && <div className='h-10'></div>}   {/* ←Spacer for bar plot and spectrum plot*/}
                {displayedPlot === 'spectra' && <MetaboliteSpectrum id={samples} />}

                {displayedPlot === 'heatmap' && <MetaboliteHeatmapComparison ids={samples} />}
              </main>

            </div>
          </dialog>
        </>
      }


    </div>
  )
}

export default CompareSamplesButton