import type { GenomeData } from 'pages/GenomeCatalogue/components/Table'

const Details = ({ genomeData }: { genomeData: GenomeData }) => {

  return (
    <div className='px-4'>
      <dl className='grid [grid-template-columns:max-content_1fr] gap-x-3 gap-y-2 
        [&>dt]:text-right [&>dt]:font-light 
      '>
        <dt>Taxonomic lineage: </dt>
        <dd className='flex flex-wrap even:[&>span]:font-extralight'>
          <span>{genomeData.domain}</span>
          <span>&nbsp;&gt;&nbsp;</span>
          <span>{genomeData.phylum}</span>
          <span>&nbsp;&gt;&nbsp;</span>
          <span>{genomeData.class}</span>
          <span>&nbsp;&gt;&nbsp;</span>
          <span>{genomeData.order}</span>
          <span>&nbsp;&gt;&nbsp;</span>
          <span>{genomeData.family}</span>
          <span>&nbsp;&gt;&nbsp;</span>
          <span>{genomeData.genus}</span>
          <span>&nbsp;&gt;&nbsp;</span>
          <span>{genomeData.species}</span>
        </dd>

        <dt>Completeness: </dt>
        <dd>{genomeData.completeness}%</dd>

        <dt>Contamination: </dt>
        <dd>{genomeData.contamination}%</dd>

        <dt>Length: </dt>
        <dd>{genomeData.length}</dd>


        {/* <dt>N50: </dt>
        <dd>{genomeData.N50}</dd> */}
      </dl>
    </div>
  )
}

export default Details