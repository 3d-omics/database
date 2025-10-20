import { useState, useEffect } from 'react'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import TableBody from 'components/Table/components/TableBody'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import genome_counts from 'assets/genome_counts.tsv'
import genome_counts2 from 'assets/genome_counts2.csv'
import ErrorBanner from 'components/ErrorBanner'
import Tabs from 'components/Tabs'
import MacrosampleTab from './components/MacrosampleTab'
import MicrosampleTab from './components/MicrosampleTab'

const SamplesContainingThisGenome = ({ genomeName }: {
  genomeName: string
}) => {

  const [microsampleIds, setMicrosampleIds] = useState<Array<{ [key: string]: string }>>([])
  const [selectedTab, setSelectedTab] = useState('Macrosample')

  // console.log(microsampleIds)

  const { fetchExcel: fetchExcel1, fetchExcelError: fetchExcelError1 } = useFetchExcelFileData({ excelFile: genome_counts })
  const { fetchExcel: fetchExcel2, fetchExcelError: fetchExcelError2 } = useFetchExcelFileData({ excelFile: genome_counts2 })

  useEffect(() => {
    Promise.all([fetchExcel1(), fetchExcel2()]).then(([counts1, counts2]) => {
      const processCounts = (counts: any) => {
        if (counts && counts.genome && Array.isArray(counts.genome)) {
          const genomeIndex = counts.genome.indexOf(genomeName)
          if (genomeIndex !== -1) {
            return Object.keys(counts)
              .filter(key => key !== "genome")
              .map(key => {
                const count = Array.isArray(counts[key]) ? counts[key][genomeIndex] : undefined
                return { microsampleId: key, count }
              })
              .filter(item => item.count !== 0 && item.count !== undefined)
          }
        }
        return []
      }

      const microsampleIdsWithValues = [
        ...processCounts(counts1),
        ...processCounts(counts2)
      ]
      setMicrosampleIds(microsampleIdsWithValues)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const columns = [
    {
      id: 'microsampleId',
      header: 'Microsample ID',
      accessorKey: 'microsampleId',
    },
    {
      id: 'count',
      header: 'Count',
      accessorKey: 'count',
    }
  ]

  const table = useReactTable({
    data: microsampleIds,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <div className=''>
      {/* {(fetchExcelError1 || fetchExcelError2) && (
        <ErrorBanner>{fetchExcelError1 || fetchExcelError2}</ErrorBanner>
      )}
      {microsampleIds.length > 0
        ? <div>
          <p className='mb-4 text-lg'><b>{microsampleIds.length}</b> {microsampleIds.length === 1 ? 'sample' : 'samples'} containing <b>{genomeName}</b></p>
          <TableBody
            table={table}
            checkedItems={[]}
            setCheckedItems={() => { }}
            checkedMetaboliteIds={[]}
            setCheckedMetaboliteIds={() => { }}
            displayTableFilters={false}
          />
        </div>
        : <p className=''>No samples containing <b>{genomeName}</b> were found.</p>
      } */}

      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={['Macrosample', 'Microsample']}
      />
      <div className='h-6'></div>
      {selectedTab === 'Macrosample' && <MacrosampleTab />}
      {selectedTab === 'Microsample' && <MicrosampleTab />}

    </div>
  )
}

export default SamplesContainingThisGenome