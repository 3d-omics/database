import { useEffect, useRef } from 'react'
import type { PhyloData } from '..'
import * as d3 from 'd3'
import { useParams } from 'react-router-dom'
import { phylumColors } from '../phylum-color-scheme'


const PhyloTreeLayer = ({ data, width, height }: { data: any, width: number, height: number }) => {

  const ref = useRef<SVGSVGElement | null>(null)
  const { experimentName = '' } = useParams()

  const linkStep = (startAngle: number, startRadius: number, endAngle: number, endRadius: number) => {
    const c0 = Math.cos((startAngle - 90) / 180 * Math.PI)
    const s0 = Math.sin((startAngle - 90) / 180 * Math.PI)
    const c1 = Math.cos((endAngle - 90) / 180 * Math.PI)
    const s1 = Math.sin((endAngle - 90) / 180 * Math.PI)

    return (
      "M" + startRadius * c0 + "," + startRadius * s0 +
      (endAngle === startAngle
        ? ""
        : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1) +
      "L" + endRadius * c1 + "," + endRadius * s1
    )
  }


  useEffect(() => {
    if (!ref.current) return

    const totalRadius = Math.min(width, height) / 2 - 40

    // Define clear separation between phylogenetic tree and circos
    const treeRadius = totalRadius * 0.53  // Inner 53% for phylogenetic tree

    // for opening the circle for labels
    const gapDegrees = 15
    const gapRadians = (gapDegrees / 360) * 2 * Math.PI
    const availableAngle = 2 * Math.PI - gapRadians

    // clear old SVG
    d3.select(ref.current).selectAll("*").remove()

    const svg = d3
      .select(ref.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height].join(' '))
      .style("font", "8px sans-serif")

    // create hierarchy with D3
    const root = d3.hierarchy<PhyloData>(data)
    root.each(node => {
      node.x = (node.x ?? 0) + gapRadians / 2
    })

    const cluster = d3.cluster<PhyloData>().size([availableAngle, treeRadius])
    cluster(root)


    // ====================================================

    // assign even angles to leaf nodes
    const leafNodes = root.leaves()
    const angleStep = availableAngle / leafNodes.length
    const angleOffset = gapRadians / 2
    leafNodes.forEach((leaf, i) => {
      leaf.x = i * angleStep + angleOffset
    })

    // propagate angles to internal nodes using circular mean
    root.eachAfter(node => {
      if (node.children) {
        node.x = d3.mean(node.children, d => d.x)
      }
    })

    // ====================================================


    const linkGroup = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 0.6)

    const links = linkGroup
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr("d", (d: any) =>
        linkStep(d.source.x * 180 / Math.PI, d.source.y, d.target.x * 180 / Math.PI, d.target.y)
      )

    // Create node groups at correct positions
    const node = svg
      .append('g')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform',
        d => `
        rotate(${(((d.x ?? 0) * 180) / Math.PI - 90)})
        translate(${d.y},0)
      `)

    // Draw circles inside each node group (so hover/label logic works)
    node
      .append('circle')
      .attr('r', 0)
      .attr('fill', '#00000040')


    // Add text labels only for leaf nodes
    const leafNodeSelection = node.filter(d => !d.children)
    leafNodeSelection
      .append('a')
      .attr('font-size', '8px')
      // .attr('line-height', '8px')
      .attr('xlink:href', d => `/database/genome-catalogues/${encodeURIComponent(experimentName)}/${encodeURIComponent(d.data.name)}`)
      // .attr('target', '_blank')
      .append('text')
      .attr('dy', '0.3em')
      .attr('x', d => ((d.x ?? 0) < Math.PI ? 8 : -8))
      .attr('text-anchor', d => ((d.x ?? 0) < Math.PI ? 'start' : 'end'))
      .attr('transform', d => ((d.x ?? 0) >= Math.PI ? 'rotate(180)' : null))
      .text(d => d.data.name)
      .clone(true)
      .lower()
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5) // .attr('stroke-width', 2)

    // Helper to find the closest ancestor (including self) with a matching category color
    function getCategory(node: d3.HierarchyPointNode<PhyloData>): string | undefined {
      let current: d3.HierarchyPointNode<PhyloData> | null = node
      while (current) {
        if (current.data.name in phylumColors) return current.data.name
        current = current.parent
      }
      return undefined
    }

    // Helper to get path from root to a specific node
    function getPathToRoot(node: d3.HierarchyPointNode<PhyloData>): d3.HierarchyPointNode<PhyloData>[] {
      const path: d3.HierarchyPointNode<PhyloData>[] = []
      let current: d3.HierarchyPointNode<PhyloData> | null = node
      while (current) {
        path.push(current)
        current = current.parent
      }
      return path
    }

    // Change link color based on the closest ancestor with a category color
    links.attr('stroke', d => {
      const targetNode = d.target as d3.HierarchyPointNode<PhyloData>
      const category = getCategory(targetNode)
      if (category && category in phylumColors) {
        return phylumColors[category]
      }
      return '#555'
    })

    // Add hover effects to leaf nodes
    leafNodeSelection
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        const hoveredNode = d as d3.HierarchyPointNode<PhyloData>
        const pathToRoot = getPathToRoot(hoveredNode)

        // Highlight the path links
        links
          .filter((d, i) => {
            return pathToRoot.some(pathNode => pathNode === d.target)
          })
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 1.6)

        // Fade out all text labels
        node.selectAll('text')
          .attr('opacity', 0.3)
          .attr('font-weight', 'normal')

        // Highlight the hovered text
        d3.select(this).selectAll('text')
          .attr('opacity', 1)
          .attr('font-weight', 'bold')
          .attr('font-size', '12px')

        // Highlight circles in the path
        node
          .filter(nodeData => pathToRoot.includes(nodeData as d3.HierarchyPointNode<PhyloData>))
          .selectAll('circle')
          .attr('opacity', 1)
          .attr('r', 0)
      })
      .on('mouseleave', function () {
        // Reset all links
        links
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 0.6)

        // Reset all text labels
        node.selectAll('text')
          .attr('opacity', 1)
          .attr('font-weight', 'normal')
          .attr('font-size', '8px')

        // Reset all circles
        node.selectAll('circle')
          .attr('opacity', 1)
          .attr('r', 0)
      })

  }, [data, width, height])


  return (
    <svg ref={ref} width={width} height={height} data-testid='phylo-tree-layer' />
  )
}

export default PhyloTreeLayer



