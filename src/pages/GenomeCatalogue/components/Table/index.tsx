import { useMemo } from 'react'
import TableView from 'components/TableView'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'


export type GenomeData = {
  genome: string,
  phylum: string,
  completeness: number,
  contamination: number,
  length: number,
  // N50: number,
  domain: string,
  class: string,
  order: string,
  family: string,
  genus: string,
  species: string,
}


const GenomeCatalogueTable = ({ metaData, allError, experimentName }: {
  metaData: Record<string, (string | number)[]>,
  allError: string | null,
  experimentName: string,
}) => {

  const data: GenomeData[] = metaData.genome.map((_: unknown, i: number) => ({
    genome: String(metaData.genome[i]),
    phylum: String(metaData.phylum[i]),
    completeness: Number(metaData.completeness[i]),
    contamination: Number(metaData.contamination[i]),
    length: Number(metaData.length[i]),
    // N50: Number(metaData.N50[i]),
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
          to={`/genome-catalogues/${encodeURIComponent(experimentName)}/${encodeURIComponent(cell.getValue())}`}
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
    // {
    //   id: 'taxonomy',
    //   header: 'Taxonomy',
    //   accessorFn: (row) => row.species,
    //   filterFn: 'equals',
    //   meta: {
    //     filterVariant: 'select' as const,
    //     uniqueValues: Array.from(new Set(data.map((row) => row.species))),
    //   },
    //   cell: ({ cell, row }: { cell: { getValue: () => any }, row: { original: GenomeData } }) => (
    //     <div className="tooltip tooltip-bottom" data-tip={`${row.original.domain || ''} > ${row.original.class || ''} > ${row.original.order || ''} > ${row.original.family || ''} > ${row.original.genus || ''} > ${cell.getValue() || 'unknown'}`}>
    //       <span className="underline">{cell.getValue() || 'unknown'}</span>
    //     </div>
    //   ),
    // },
    {
      id: 'completeness',
      header: 'Completeness',
      accessorFn: (row) => `${row.completeness}%`,
      enableColumnFilter: false,
    },
    {
      id: 'contamination',
      header: 'Contamination',
      accessorFn: (row) => `${row.contamination}%`,
      enableColumnFilter: false,
    },
    {
      id: 'length',
      header: 'Size', // 'Length'
      accessorFn: (row) => row.length,
      enableColumnFilter: false,
    },
    // {
    //   id: 'N50',
    //   header: 'N50',
    //   accessorFn: (row) => row.N50,
    //   enableColumnFilter: false,
    // },
  ], [metaData])

  return (
    <TableView
      data={data}
      columns={columns}
      first100Loading={false}
      allLoading={false}
      first100Error={null}
      allError={allError}
      pageTitle={'Genome Metadata'}
    />
  )
}

export default GenomeCatalogueTable
