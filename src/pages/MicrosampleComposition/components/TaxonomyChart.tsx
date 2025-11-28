import { useState, useEffect, useMemo, useCallback } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ErrorBanner from 'components/ErrorBanner'
import { dynamicXAxisPlugin, flattenedcolorScheme } from 'utils/chartUtils'
import { useTaxonomyData } from 'hooks/useTaxonomyData'
import { useTaxonomyChart } from 'hooks/useTaxonomyChart'
import { useGenomeJsonFile } from 'hooks/useJsonData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

const MicrosampleTaxonomyChart = ({ 
  cryosection, 
  microsampleIds, 
  selectedTaxonomicLevel, 
  setSelectedTaxonomicLevel,
  experimentId  
}: {
  cryosection: string
  microsampleIds: string[]
  selectedTaxonomicLevel: string
  setSelectedTaxonomicLevel: React.Dispatch<React.SetStateAction<string>>
  experimentId: string 
}) => {
  const taxonomicLevels = ["phylum", "class", "order"]
  // const taxonomicLevels = ["phylum", "class", "order", "family", "genus", "species"]
  const [isInitializing, setIsInitializing] = useState(true)
  const [isChangingLevel, setIsChangingLevel] = useState(false)

  // ===== Chart width calculation =====
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [chartWidth, setChartWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (windowWidth >= 1280) {
      setChartWidth(windowWidth - ((35 * windowWidth / 100) + 320 + 48 + 16))
    } else if (windowWidth >= 768) {
      setChartWidth(windowWidth - (48 + 320 + 16))
    } else {
      setChartWidth(windowWidth - (32 + 32))
    }
  }, [windowWidth])

  // ===== Load genome metadata based on experimentId =====
  const metadataData = useGenomeJsonFile(
    'genome_metadata',
    `experiment_${experimentId}_metadata`
  )

  // ===== Load microsample counts for this cryosection =====
  const countsData = useGenomeJsonFile(
    'microsample_counts',
    cryosection
  )

  // ===== Load color scheme based on experimentId =====
  const colorScheme = useMemo(() => {
    try {
      const colorSchemeFiles = import.meta.glob(
        '/src/config/colorScheme/*.ts',
        { eager: true }
      )
      
      const colorSchemeModule = 
        // colorSchemeFiles[`/src/config/colorScheme/taxonomy-color-scheme-${experimentId}.ts`]
    colorSchemeFiles[`/src/config/colorScheme/taxonomy-color-scheme.ts`];

      if (!colorSchemeModule) {
        console.warn(`Color scheme for experiment ${experimentId} not found, using default`)
        return {}
      }

      return (colorSchemeModule as any).colorScheme || {}
    } catch (error) {
      console.error('Error loading color scheme:', error)
      return {}
    }
  }, [experimentId])

  // ===== Fetch and process taxonomy data =====
  const { taxonomyData, genomeCounts, isDataReady, fetchError } = useTaxonomyData({
    metadataFile: metadataData,
    countsFile: countsData,
    sampleIds: microsampleIds
  })


  // ===== Generate chart data and options =====
  const { chartData, options } = useTaxonomyChart({
    sampleIds: microsampleIds,
    genomeCounts,
    taxonomyData,
    selectedTaxonomicLevel,
    colorScheme: flattenedcolorScheme(colorScheme),
    xAxisLabel: 'Microsample ID',
  })

  // ===== Handle taxonomic level change with loading state =====
  const handleLevelChange = useCallback((level: string) => {
    // Set loading state immediately
    setIsChangingLevel(true)
    
    // Use setTimeout to allow React to render the loading state first
    setTimeout(() => {
      setSelectedTaxonomicLevel(level)
      
      // Clear loading state after state update and re-render
      setTimeout(() => {
        setIsChangingLevel(false)
      }, 100)
    }, 0)
  }, [setSelectedTaxonomicLevel])

  // ===== Remove initial loading state after data is loaded =====
  useEffect(() => {
    if (countsData && metadataData) {
      const timer = setTimeout(() => setIsInitializing(false), 100)
      return () => clearTimeout(timer)
    }
  }, [countsData, metadataData])

  // ===== Error handling =====
  const hasError = !metadataData || !countsData || fetchError

  if (hasError) {
    return (
      <section className='px-8'>
        <ErrorBanner>
          {fetchError || 'Failed to load taxonomy data'}
        </ErrorBanner>
      </section>
    )
  }

  // Show full loading skeleton during initialization
  if (isInitializing || !isDataReady) {
    return (
      <div className="grow flex flex-col pl-4 max-md:pl-0">
        <div className="animate-pulse flex flex-col w-[95%] max-w-3xl">
          <div className="h-6 bg-gray-200 rounded w-[80%] mb-4"></div>
          <div className="h-[70vh] bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grow flex flex-col pl-4 max-md:pl-0">
      <div className="flex items-center mb-3 px-3 taxonomic-level-buttons">
        <p className="text-sm font-bold mr-1.5 whitespace-nowrap">Taxonomic Level:</p>
        <div>
          {(chartWidth ?? 0) > 520 ? (
            taxonomicLevels.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                disabled={isChangingLevel}
                className={`btn btn-xs border-none mr-1 ${
                  selectedTaxonomicLevel === level && "bg-light_burgundy text-white"
                } ${isChangingLevel && "opacity-50 cursor-not-allowed"}`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))
          ) : (
            <select
              value={selectedTaxonomicLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              disabled={isChangingLevel}
              className='btn btn-xs bg-gray-200 border-none outline-none'
            >
              {taxonomicLevels.map((level) => (
                <option value={level} key={level}>{level}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className='relative h-[78vh] w-[calc(100vw-(35vw+320px+48px+16px))]
          max-xl:w-[calc(100vw-(320px+48px+16px))] max-md:w-[calc(100vw-(32px+32px))]'>
        <Bar data={chartData} options={options} />
        {/* Loading overlay - shows when changing levels */}
        {isChangingLevel && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-light_burgundy rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600">Updating chart...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MicrosampleTaxonomyChart



// import { useState, useEffect, useMemo } from 'react'
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
// import { Bar } from 'react-chartjs-2'
// import ErrorBanner from 'components/ErrorBanner'
// import { dynamicXAxisPlugin, flattenedcolorScheme } from 'utils/chartUtils'
// import { useTaxonomyData } from 'hooks/useTaxonomyData'
// import { useTaxonomyChart } from 'hooks/useTaxonomyChart'
// import { useGenomeJsonFile } from 'hooks/useJsonData'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, dynamicXAxisPlugin)

// const MicrosampleTaxonomyChart = ({ 
//   cryosection, 
//   microsampleIds, 
//   selectedTaxonomicLevel, 
//   setSelectedTaxonomicLevel,
//   experimentId  
// }: {
//   cryosection: string
//   microsampleIds: string[]
//   selectedTaxonomicLevel: string
//   setSelectedTaxonomicLevel: React.Dispatch<React.SetStateAction<string>>
//   experimentId: string 
// }) => {
//   const taxonomicLevels = ["phylum", "class", "order", "family", "genus", "species"]

//   // ===== Chart width calculation =====
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth)
//   const [chartWidth, setChartWidth] = useState<number | null>(null)

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth)
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   useEffect(() => {
//     if (windowWidth >= 1280) {
//       setChartWidth(windowWidth - ((35 * windowWidth / 100) + 320 + 48 + 16))
//     } else if (windowWidth >= 768) {
//       setChartWidth(windowWidth - (48 + 320 + 16))
//     } else {
//       setChartWidth(windowWidth - (32 + 32))
//     }
//   }, [windowWidth])

//   // ===== Load genome metadata based on experimentId =====
//   const metadataData = useGenomeJsonFile(
//     'genome_metadata',
//     `experiment_${experimentId}_metadata`
//   )

//   // ===== Load microsample counts for this cryosection =====
//   const countsData = useGenomeJsonFile(
//     'microsample_counts',
//     cryosection
//   )

//   // ===== Load color scheme based on experimentId =====
//   const colorScheme = useMemo(() => {
//     try {
//       const colorSchemeFiles = import.meta.glob(
//         '/src/config/colorScheme/*.ts',
//         { eager: true }
//       )
      
//       const colorSchemeModule = 
//         colorSchemeFiles[`/src/config/colorScheme/taxonomy-color-scheme-${experimentId}.ts`]

//       if (!colorSchemeModule) {
//         console.warn(`Color scheme for experiment ${experimentId} not found, using default`)
//         return {}
//       }

//       return (colorSchemeModule as any).colorScheme || {}
//     } catch (error) {
//       console.error('Error loading color scheme:', error)
//       return {}
//     }
//   }, [experimentId])

//   // ===== Fetch and process taxonomy data =====
//   const { taxonomyData, genomeCounts, isDataReady, fetchError } = useTaxonomyData({
//     metadataFile: metadataData,
//     countsFile: countsData,
//     sampleIds: microsampleIds
//   })

//   // ===== Generate chart data and options =====
//   const { chartData, options } = useTaxonomyChart({
//     sampleIds: microsampleIds,
//     genomeCounts,
//     taxonomyData,
//     selectedTaxonomicLevel,
//     colorScheme: flattenedcolorScheme(colorScheme),
//     xAxisLabel: 'Microsample ID',
//   })

//   // ===== Error handling =====
//   const hasError = !metadataData || !countsData || fetchError

//   if (hasError) {
//     return (
//       <section className='px-8'>
//         <ErrorBanner>
//           {fetchError || 'Failed to load taxonomy data'}
//         </ErrorBanner>
//       </section>
//     )
//   }

//   return (
//     <div className="grow flex flex-col pl-4 max-md:pl-0">
//       {!isDataReady ? (
//         <div className="">
//           <div className="animate-pulse flex flex-col w-[95%] max-w-3xl">
//             <div className="h-6 bg-gray-200 rounded w-[80%] mb-4"></div>
//             <div className="h-[70vh] bg-gray-200 rounded w-full"></div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="flex items-center mb-3 px-3 taxonomic-level-buttons">
//             <p className="text-sm font-bold mr-1.5 whitespace-nowrap">Taxonomic Level:</p>
//             <div>
//               {(chartWidth ?? 0) > 520 ? (
//                 taxonomicLevels.map((level) => (
//                   <button
//                     key={level}
//                     className={`btn btn-xs border-none mr-1 ${selectedTaxonomicLevel === level && "bg-light_burgundy text-white"
//                       }`}
//                     onClick={() => setSelectedTaxonomicLevel(level)}
//                   >
//                     {level.charAt(0).toUpperCase() + level.slice(1)}
//                   </button>
//                 ))
//               ) : (
//                 <select
//                   value={selectedTaxonomicLevel}
//                   onChange={(e) => setSelectedTaxonomicLevel(e.target.value)}
//                   className='btn btn-xs bg-gray-200 border-none outline-none'
//                 >
//                   {taxonomicLevels.map((level) => (
//                     <option value={level} key={level}>{level}</option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           </div>

//           <div className='relative h-[78vh] w-[calc(100vw-(35vw+320px+48px+16px))]
//               max-xl:w-[calc(100vw-(320px+48px+16px))] max-md:w-[calc(100vw-(32px+32px))]'>
//             <Bar data={chartData} options={options} />
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default MicrosampleTaxonomyChart

