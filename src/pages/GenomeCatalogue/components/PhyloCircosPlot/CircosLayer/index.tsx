import { useEffect, useRef } from 'react'
import type { PhyloData, CircosData } from '..'
import * as d3 from 'd3'
import { getPhylumColor } from '../phylum-color-scheme'

const CircosLayer = ({
  phyloData,
  circosData,
  width,
  height
}: {
  phyloData: PhyloData,
  circosData: CircosData,
  width: number,
  height: number
}) => {
  const groupRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    if (!groupRef.current || !phyloData || !circosData) return

    // Clear previous content
    const g = d3.select(groupRef.current)
    g.selectAll('*').remove()

    // Prepare tree layout to get leaves & angles
    const root = d3.hierarchy(phyloData)
    const treeLayout = d3.tree<PhyloData>().size([2 * Math.PI, Math.min(width, height) / 2 - 100])
    const treeData = treeLayout(root)

    const leafNodes = treeData.descendants().filter(d => !d.children)

    // Circos parameters
    const circosWidth = 150
    const circosInnerRadius = Math.min(width, height) / 2 - circosWidth - 20

    const metrics = [
      { key: 'phylum', label: 'Phylum', color: '#efefef', maxValue: 1 },
      { key: 'completeness', label: 'Genome Quality', color: '#2E8B57', maxValue: 100 },
      { key: 'length', label: 'Genome Size', color: '#4169E1', maxValue: 100 }
    ]

    // Calculate max value for length dynamically
    const allData = Object.values(circosData)
    metrics[2].maxValue = Math.max(...allData.map(d => d.length))

    // ✅ Add dynamic color scales for each metric:
    const colorScales = {
      completeness: d3.scaleLinear<string>()
        .domain([0, 17])
        .range(['#d1f4ba', '#f4baba']), // Light green to dark green

      length: d3.scaleSequential<string>(d3.interpolatePRGn)
        .domain([0, metrics[2].maxValue]),
    }

    const bandHeight = circosWidth / metrics.length

    // Container for all circos elements — center at svg center
    const circosGroup = g.append('g')
      .attr('class', 'circos-layer')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    // Bars for each leaf node
    const totalLeaves = leafNodes.length
    leafNodes.forEach((node, i) => {
      const leafName = node.data.name


      // for opening the circle for labels
      const gapDegrees = 15
      const gapRadians = (gapDegrees / 360) * 2 * Math.PI
      const availableAngle = 2 * Math.PI - gapRadians



      // Equal angular position
      // const nodeAngle = (i / totalLeaves) * 2 * Math.PI
      const nodeAngle = (i / totalLeaves) * availableAngle + gapRadians / 2

      const leafData = circosData[leafName]
      if (!leafData) return

      metrics.forEach((metric, i) => {
        const value = leafData[metric.key as keyof typeof leafData]

        let barHeightValue = value
        let colorValue = value

        if (metric.key === 'phylum') {
          // Phylum: uses fixed height & string-based color
          barHeightValue = 0.5 // always same height, normalized by maxValue = 1
          colorValue = leafData.phylum
        } else {
          // Genome Size
          barHeightValue = leafData[metric.key as keyof typeof leafData] as number
          colorValue = barHeightValue

          if (metric.key === 'completeness') {
            // Genome Quality: height comes from completeness, and color comes from contamination
            barHeightValue = leafData.completeness
            colorValue = leafData.contamination
          }
        }

        const normalizedValue = (barHeightValue / metric.maxValue) * bandHeight * 0.8

        const innerRadius = metric.key === 'completeness' ? circosInnerRadius + (i * bandHeight * 0.6) : circosInnerRadius + (i * bandHeight * 0.8)
        // const innerRadius = circosInnerRadius + (i * bandHeight)
        const outerRadius = innerRadius + normalizedValue

        const angleSpan = (2 * Math.PI) / leafNodes.length * 1
        // const angleSpan = availableAngle / totalLeaves 

        const startAngle = nodeAngle - angleSpan / 2
        const endAngle = nodeAngle + angleSpan / 2

        const arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle)

        circosGroup
          .append('path')
          .attr('d', arc as any) // TS quirk: d3.arc() type can be fussy
          .attr("data-testid", "circos-path") // for testing
          // .attr('fill', metric.color) // for static color
          // .attr('fill', colorScales[metric.key as keyof typeof colorScales](value))
          .attr('fill',
            metric.key === 'phylum'
              ? getPhylumColor(colorValue as string) // special color by string
              // ? phylumColor(colorValue as string) // special color by string
              : metric.key === 'completeness'
                ? colorScales.completeness(colorValue as number)
                : colorScales[metric.key as keyof typeof colorScales](colorValue as number)
          )
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.8)
          .on('mouseenter', function (event) {
            d3.select(this).attr('opacity', 1)

            const tooltip = d3.select('body').append('div')
              .attr('class', 'tooltip')
              .style('position', 'absolute')
              .style('background', 'rgba(0,0,0,0.8)')
              .style('color', 'white')
              .style('padding', '8px')
              .style('border-radius', '4px')
              .style('font-size', '12px')
              .style('pointer-events', 'none')
              .style('z-index', '1000')
              .style('opacity', 0)
            if (metric.label === "Genome Quality") {
              tooltip.html(`
                &nbsp;<strong>${leafName}</strong>&nbsp;
                <br/>
                &nbsp;Completeness: ${leafData.completeness}&nbsp;
                <br/>
                &nbsp;Contamination: ${leafData.contamination}&nbsp;
                `)
            } else {
              tooltip.html(`
                &nbsp;<strong>${leafName}</strong> &nbsp;
                <br/>
                &nbsp;${metric.label}: ${value} &nbsp;
                `)
            }
            tooltip
              .attr('class', 'circos-tooltip')
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px')
              .transition()
              .duration(200)
              .style('opacity', 1)
          })
          .on('mouseleave', function () {
            d3.select(this).attr('opacity', 0.8)
            d3.selectAll('.circos-tooltip').remove()
          })
      })
    })

  }, [phyloData, circosData, width, height])

  return <g ref={groupRef} data-testid="circos-layer" />
}

export default CircosLayer

