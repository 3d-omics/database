import { useEffect, useState } from 'react'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import { useParams } from 'react-router-dom'
import TableBody from 'components/Table/components/TableBody'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'


const MacrosampleTab = () => {

  const [macrosampleIds, setMacrosampleIds] = useState<Array<{ [key: string]: string }>>([])

  const { genomeName = '', experimentName = '' } = useParams()
  const experimentId = experimentName.charAt(0)

  const csvFiles = import.meta.glob('../../../../../assets/data/macro_genome_counts/*.csv', {
    eager: true,
    query: '?url',
    import: 'default'
  });

  const csvUrl = csvFiles[`../../../../../assets/data/macro_genome_counts/experiment_${experimentId}_counts.csv`];

  const { fetchExcel, fetchExcelError } = useFetchExcelFileData({ excelFile: csvUrl })

  useEffect(() => {
    fetchExcel().then(counts => {
      if (!counts || !counts.genome || !Array.isArray(counts.genome)) {
        setMacrosampleIds([])
        return
      }
      const genomeIndex = counts.genome.indexOf(genomeName)
      if (genomeIndex === -1) {
        setMacrosampleIds([])
        return
      }
      const macrosampleIdsWithValues = Object.entries(counts)
        .filter(([key]) => key !== "genome")
        .map(([macrosampleId, arr]: [string, any]) => ({
          macrosampleId,
          count: Array.isArray(arr) ? arr[genomeIndex] : undefined
        }))
        .filter(item => item.count)
      setMacrosampleIds(macrosampleIdsWithValues)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log(macrosampleIds)

  const columns = [
    {
      id: 'macrosampleId',
      header: 'Macrosample ID',
      accessorKey: 'macrosampleId',
    },
    {
      id: 'count',
      header: 'Count',
      accessorKey: 'count',
    }
  ]

  const table = useReactTable({
    data: macrosampleIds,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <div>
      {macrosampleIds.length > 0
        ? <div>
          <p className='mb-4 text-lg'><b>{macrosampleIds.length}</b> {macrosampleIds.length === 1 ? 'macrosample' : 'macrosamples'} containing <b>{genomeName}</b></p>
          <TableBody
            table={table}
            checkedItems={[]}
            setCheckedItems={() => { }}
            checkedMetaboliteIds={[]}
            setCheckedMetaboliteIds={() => { }}
            displayTableFilters={false}
          />
        </div>
        : <p className=''>No macrosamples containing <b>{genomeName}</b> were found.</p>
      }

    </div>
  )
}

export default MacrosampleTab