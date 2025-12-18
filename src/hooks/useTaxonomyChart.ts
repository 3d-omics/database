import { useMemo } from 'react'
import { TaxonomyData } from './useTaxonomyData'

interface UseTaxonomyChartParams {
  sampleIds: string[]
  genomeCounts: number[][] | null
  taxonomyData: TaxonomyData
  selectedTaxonomicLevel: string
  colorScheme: Record<string, string>
  xAxisLabel: string
}

export const useTaxonomyChart = ({ sampleIds, genomeCounts, taxonomyData, selectedTaxonomicLevel, colorScheme, xAxisLabel }:
  UseTaxonomyChartParams
) => {

  const { chartData, options } = useMemo(() => {
    if (!genomeCounts || !sampleIds.length || !taxonomyData[selectedTaxonomicLevel]) {
      return { chartData: { labels: [], datasets: [] }, options: {} }
    }

    // Remove taxonomy prefixes (e.g., 'p__', 'c__', etc.)
    const taxonomyLabels = taxonomyData[selectedTaxonomicLevel].map(
      taxon => taxon.replace(/^[a-zA-Z]__/, '')
    )

    // Create datasets for each taxonomic group
    const colorSchemeKeys = Object.keys(colorScheme)
    const datasets = taxonomyLabels
      .map((label, index) => {
        const data = genomeCounts.map((counts: number[]) => counts[index] || 0)
        return {
          label,
          data,
          backgroundColor: colorScheme[label] || '#CCCCCC',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 0,
        }
      })
      // Sort datasets by color scheme order (reversed for stacking)
      .sort((a, b) => {
        const aIndex = colorSchemeKeys.indexOf(a.label)
        const bIndex = colorSchemeKeys.indexOf(b.label)
        return bIndex - aIndex
      })

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: {
            autoSkip: false,
          },
          title: {
            display: true,
            text: xAxisLabel,
            font: { size: 12 }
          },
          grid: {
            display: false,
            drawTicks: false,
          },
        },
        y: {
          stacked: true,
          max: 1,
          ticks: {
            stepSize: 0.2,
            font: { size: 10 },
          },
          title: {
            display: true,
            text: 'Relative Abundance',
            font: { size: 12 }
          },
          grid: {
            drawTicks: false,
          },
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || ''
              const value = context.parsed.y
              return `${label}: ${value}`
            },
          }
        },
        legend: { display: false },
      },
      animation: false as const,
      elements: {
        bar: { borderWidth: 0 }
      },
    }

    return {
      chartData: { labels: sampleIds, datasets },
      options
    }
  }, [sampleIds, genomeCounts, taxonomyData, selectedTaxonomicLevel, colorScheme, xAxisLabel])

  return { chartData, options }
}




