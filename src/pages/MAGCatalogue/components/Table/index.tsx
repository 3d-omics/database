import { useMemo } from 'react'
import TableView from 'components/TableView'
import { ColumnDef, CellContext } from '@tanstack/react-table'
import { Link } from 'react-router-dom'


export type GenomeData = {
  genome: string,
  phylum: string,
  completeness: number,
  contamination: number,
  length: number,
  domain: string,
  class: string,
  order: string,
  family: string,
  genus: string,
  species: string,
}


const MAGCatalogueTable = ({ metaData, experimentName }: {
  metaData: Record<string, (string | number)[]>,
  experimentName: string,
}) => {

  const data: GenomeData[] = metaData.genome.map((_: unknown, i: number) => ({
    genome: String(metaData.genome[i]),
    phylum: String(metaData.phylum[i]),
    completeness: Number(metaData.completeness[i]),
    contamination: Number(metaData.contamination[i]),
    length: Number(metaData.length[i]),
    domain: String(metaData.domain[i]),
    class: String(metaData.class[i]),
    order: String(metaData.order[i]),
    family: String(metaData.family[i]),
    genus: String(metaData.genus[i]),
    species: String(metaData.species[i]),
  }))


  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'genome',
      header: 'Genome',
      accessorFn: (row) => row.genome,
      cell: ({ cell, row }: { cell: { getValue: () => any }, row: { original: GenomeData } }) => (
        <Link
          to={`/mag-catalogues/${encodeURIComponent(experimentName)}/${encodeURIComponent(cell.getValue())}`}
          className="link"
        >
          <span>{cell.getValue() || 'unknown'}</span>
        </Link>
      ),
    },
    {
      id: 'phylum',
      header: 'Phylum',
      accessorFn: (row) => row.phylum,
      filterFn: 'equals',
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.phylum))),
      },
    },
    {
      id: 'taxonomy',
      header: 'Taxonomy',
      accessorFn: (row) => `${row.domain || ''} > ${row.phylum || ''} > ${row.class || ''} > ${row.order || ''} > ${row.family || ''} > ${row.genus || ''} > ${row.species || 'unknown'}`,
      // accessorFn: (row) => `${row.domain || ''} > ${row.class || ''} > ${row.order || ''} > ${row.family || ''} > ${row.genus || ''} > ${row.species || 'unknown'}`,
      meta: {
        filterVariant: 'select' as const,
        uniqueValues: Array.from(new Set(data.map((row) => row.species))),
      },
      cell: ({ cell, row }: { cell: { getValue: () => any }, row: { original: GenomeData } }) => (
        <div className="tooltip tooltip-bottom" data-tip={cell.getValue()} data-testid='taxonomy-tooltip'>
          <span className="underline decoration-dotted">{row.original.species || 'unknown'}</span>
        </div>
      ),
    },
    {
      id: 'completeness',
      header: 'Completeness',
      accessorFn: (row) => `${row.completeness}%`,
      enableColumnFilter: false,
      cell: ({ cell, row }: { cell: { getValue: () => any }, row: { original: GenomeData } }) => (
        <span className='flex'>
          <div
            className='w-3 mr-1'
            style={{
              backgroundColor: (() => {
                const contaminations = data.map(d => d.contamination);
                const min = Math.min(...contaminations);
                const max = Math.max(...contaminations);
                const value = row.original.contamination;

                // Normalize value between 0 and 1
                const normalized = max === min ? 0 : (value - min) / (max - min);

                // Interpolate between #d1f4ba (low) and #f4baba (high)
                const r = Math.round(209 + (244 - 209) * normalized);
                const g = Math.round(244 - (244 - 186) * normalized);
                const b = Math.round(186 + (186 - 186) * normalized);

                return `rgb(${r}, ${g}, ${b})`;
              })()
            }}
          />
          {cell.getValue()}
        </span>
      ),
    },
    {
      id: 'contamination',
      header: 'Contamination',
      accessorFn: (row) => `${row.contamination}%`,
      enableColumnFilter: false,
      cell: ({ cell, row }: { cell: { getValue: () => any }, row: { original: GenomeData } }) => (
        <span className='flex'>
          <div
            className='w-3 mr-1'
            style={{
              backgroundColor: (() => {
                const contaminations = data.map(d => d.contamination);
                const min = Math.min(...contaminations);
                const max = Math.max(...contaminations);
                const value = row.original.contamination;

                // Normalize value between 0 and 1
                const normalized = max === min ? 0 : (value - min) / (max - min);

                // Interpolate between #d1f4ba (low) and #f4baba (high)
                const r = Math.round(209 + (244 - 209) * normalized);
                const g = Math.round(244 - (244 - 186) * normalized);
                const b = Math.round(186 + (186 - 186) * normalized);

                return `rgb(${r}, ${g}, ${b})`;
              })()
            }}
          />
          {cell.getValue()}
        </span>
      ),
    },
    {
      id: 'length',
      header: 'Size', // 'Length'
      accessorFn: (row) => row.length,
      enableColumnFilter: false,
    },
  ], [metaData])

  return (
    <TableView
      data={data}
      columns={columns}
      pageTitle={'Genome Metadata'}
    />
  )
}

export default MAGCatalogueTable
