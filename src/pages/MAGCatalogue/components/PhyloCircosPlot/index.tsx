import { useRef } from 'react'
import PhyloTreeLayer from './PhyloTreeLayer'
import CircosLayer from './CircosLayer'

export type PhyloData = {
  name: string;
  children?: PhyloData[]
}

export type CircosData = {
  [leafName: string]: {
    phylum: string;
    completeness: number;
    contamination: number;
    length: number;
    N50: number;
  }
}

const PhylogeneticTree = ({ phyloData, circosData }: { phyloData: PhyloData, circosData: CircosData }) => {
  const width = 1000
  const height = 1000
  const svgRef = useRef<SVGSVGElement | null>(null)

  return (
    <div className="flex justify-center items-center overflow-auto max-lg:justify-start relative">
      <p className='absolute top-[78px] -ml-2 text-[11px] font-light max-lg:left-[470px]'>Genome size</p>
      <p className='absolute top-[116px] -ml-2 text-[11px] font-light max-lg:left-[465px]'>Genome quality</p>
      <p className='absolute top-[153px] -ml-2 text-[11px] font-light max-lg:left-[485px]'>Phylum</p>

      <div>
        <svg ref={svgRef} width={width} height={height} className='relative z-0'>
          <CircosLayer phyloData={phyloData} circosData={circosData} width={width} height={height} />
          <g className='z-10'>
            <PhyloTreeLayer data={phyloData} width={width} height={height} />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default PhylogeneticTree
