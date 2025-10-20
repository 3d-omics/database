import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import Plot from "react-plotly.js"
import { log10, log2 } from "mathjs"
import excelFile from "assets/data/metabolomics.xlsx"
import { Layout, Config } from 'plotly.js'
import jStat from "jstat"

const VolcanoPlot = ({ compareBetween, group1, group2, executeCreatePlot, setExecuteCreatePlot, calculatedData, setCalculatedData, pValueThreshold, foldChangeThreshold, setPValueThreshold, setFoldChangeThreshold }: {
  compareBetween: string,
  group1: string | number,
  group2: string | number,
  executeCreatePlot: boolean,
  setExecuteCreatePlot: React.Dispatch<React.SetStateAction<boolean>>
  calculatedData: {
    metabolite: string
    fold_change: number
    p_value: number
    significant: boolean
  }[] | null
  setCalculatedData: React.Dispatch<React.SetStateAction<{
    metabolite: string
    fold_change: number
    p_value: number
    significant: boolean
  }[] | null>>
  pValueThreshold: number
  foldChangeThreshold: number
  setPValueThreshold: React.Dispatch<React.SetStateAction<number>>
  setFoldChangeThreshold: React.Dispatch<React.SetStateAction<number>>
}) => {

  const red = '#B30059' // color for Significant Up
  const blue = '#0057D9' // color for Significant Down
  const grey = '#808080' // color for All Metabolites

  const [currentlyDisplayedPlot, setCurrentlyDisplayedPlot] = useState({
    compareBetween,
    group1,
    group2,
  })

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (group1 === "1" || group1 === "3") {
      group1 = Number(group1)
    }
    if (group2 === "1" || group2 === "3") {
      group2 = Number(group2)
    }

    if (executeCreatePlot) {
      fetchExcelFile().then(() => {
        setCurrentlyDisplayedPlot({
          compareBetween,
          group1,
          group2,
        })
        setExecuteCreatePlot(false)
      })
    }
  }, [executeCreatePlot])


  const fetchExcelFile = async () => {
    try {
      const response = await fetch(excelFile)
      const blob = await response.blob()

      const reader = new FileReader()
      reader.onload = (e) => {
        if (!e.target) return
        const binaryStr = e.target.result
        const workbook = XLSX.read(binaryStr, { type: "binary" })

        const abundancesSheet = XLSX.utils.sheet_to_json(
          workbook.Sheets["Abundances"]
        )
        const metadataSheet = XLSX.utils.sheet_to_json(
          workbook.Sheets["Sample metadata"]
        )
        const annotationsSheet = XLSX.utils.sheet_to_json(
          workbook.Sheets["Swine trial annotated list"]
        )

        processVolcanoData(abundancesSheet, metadataSheet, annotationsSheet)
      }
      reader.readAsBinaryString(blob)
    } catch (error) {
      console.error("Error loading the Excel file:", error)
    }
  }

  const processVolcanoData = (abundances: any[], metadata: any[], annotations: any[]) => {
    const sampleCol = "SAMPLE_ID"
    const metaboliteCol = "Feature_ID"
    const groupCol = compareBetween

    const group1Samples = metadata
      .filter((row) => row[groupCol] === group1)
      .map((row) => row[sampleCol]);

    const group2Samples = metadata
      .filter((row) => row[groupCol] === group2)
      .map((row) => row[sampleCol]);

    let results = abundances.map((row) => {
      const metabolite = row[metaboliteCol];

      const data1 = group1Samples.map((sample) => row[sample]).filter(Boolean);
      const data2 = group2Samples.map((sample) => row[sample]).filter(Boolean);

      if (data1.length === 0 || data2.length === 0) return null;

      const mean1 = jStat.mean(data1)
      const mean2 = jStat.mean(data2)
      const S2 = (jStat.sum(jStat.pow(jStat.subtract(data1, mean1), 2)) + jStat.sum(jStat.pow(jStat.subtract(data2, mean2), 2))) / (data1.length + data2.length - 2)
      const ttestResult = (mean1 - mean2) / Math.sqrt(S2 / data1.length + S2 / data2.length) // t-statistic 
      const pVal2 = jStat.studentt.cdf(-Math.abs(ttestResult), data1.length + data2.length - 2) * 2 // two side p-value
      const pVal = log10(pVal2) * -1

      const foldChange = mean2 !== 0 ? log2(mean1 / mean2) : null;

      return {
        metabolite,
        p_value: pVal,
        fold_change: foldChange,
        significant: pVal > -log10(pValueThreshold) && foldChange !== null && Math.abs(foldChange) > foldChangeThreshold
      };
    });

    results = results.filter((result): result is { metabolite: string, fold_change: number | null, p_value: number, significant: boolean } => result !== null);

    // Replace metabolite codes with curated names
    const annotationsMap = Object.fromEntries(
      annotations.map((row) => [
        row["Feature_ID"],
        // row["Curated ID"] 
        row["Curated ID"] === "Unknown" ? row["Feature_ID"] : row["Curated ID"]
      ])
    );

    results = results.map((row) => {
      if (row === null) return row;
      return {
        ...row,
        metabolite: annotationsMap[row.metabolite] || row.metabolite,
      };
    });

    setCalculatedData(results.filter((result): result is { metabolite: string, fold_change: number, p_value: number, significant: boolean } => result !== null && result.fold_change !== null));
  };

  const data: any[] = calculatedData ? [
    {
      type: "scattergl",
      name: "All Metabolites",
      x: calculatedData.map((d) => d.fold_change),
      y: calculatedData.map((d) => d.p_value),
      mode: "markers",
      marker: { color: grey, size: 3, opacity: 0.3 },
      text: calculatedData.map((d) => d.metabolite),
      hoverinfo: 'text',
      showlegend: windowWidth > 768,
      // hovertemplate: '<span style="background-color: #E4E0BE">%{text}</span><extra></extra>'
    },
    {
      type: "scatter",
      name: "Significant UP",
      x: calculatedData
        .filter((d) => d.p_value > -log10(pValueThreshold) && d.fold_change > foldChangeThreshold)
        .map((d) => d.fold_change),
      y: calculatedData
        .filter((d) => d.p_value > -log10(pValueThreshold) && d.fold_change > foldChangeThreshold)
        .map((d) => d.p_value),
      mode: "markers+text",
      marker: { color: red, size: 8, opacity: 1 },
      text: calculatedData
        .filter((d) => d.p_value > -log10(pValueThreshold) && d.fold_change > foldChangeThreshold)
        .map((d) => d.metabolite),
      textfont: { color: red, size: 10 },
      hoverinfo: 'text',
      hoverlabel: { bgcolor: red },
      showlegend: windowWidth > 768,
      // hovertemplate: '<span style="background-color: #B30059">%{text}</span><extra></extra>'
    },
    {
      type: "scatter",
      name: "Significant DOWN",
      x: calculatedData
        .filter((d) => d.p_value > -log10(pValueThreshold) && d.fold_change < -foldChangeThreshold)
        .map((d) => d.fold_change),
      y: calculatedData
        .filter((d) => d.p_value > -log10(pValueThreshold) && d.fold_change < -foldChangeThreshold)
        .map((d) => d.p_value),
      mode: "markers+text",
      marker: { color: blue, size: 8 },
      text: calculatedData
        .filter((d) => d.p_value > -log10(pValueThreshold) && d.fold_change < -foldChangeThreshold)
        .map((d) => d.metabolite),
      textfont: { color: blue, size: 10 },
      hoverinfo: 'text',
      hoverlabel: { bgcolor: blue },
      showlegend: windowWidth > 768,
      // hovertemplate: '<span style="background-color: #0057D9">%{text}</span><extra></extra>'
    },
  ] : [];


  const layout: Partial<Layout> = {
    // paper_bgcolor: '#e6e6e6',
    // plot_bgcolor: '#e9e9e9',
    // height: window.innerHeight,
    // height: 420,
    // height: volcanoPlotRef.current ? volcanoPlotRef.current.offsetHeight - 140 : 420,
    // width: 900,
    // width: volcanoPlotRef.current ? volcanoPlotRef.current.offsetWidth - 40 : 900,
    width: windowWidth > 768 ? 700 : windowWidth - 64,
    margin: { t: 0, r: 0, l: 40, },
    title: "",
    xaxis: {
      title: {
        text: "log2 (Fold Change)",
        font: { size: windowWidth > 768 ? 12 : 10 }
      },
      tickfont: {
        size: windowWidth > 768 ? 12 : 8,
      }
    },
    yaxis: {
      title: {
        text: "-log10 (p-value)",
        font: { size: windowWidth > 768 ? 12 : 10 }
      },
      tickfont: {
        size: windowWidth > 768 ? 12 : 8,
      }
    },
    shapes: [
      { type: "line", x0: 0, x1: 0, y0: 0, y1: calculatedData ? Math.max(...calculatedData.map((d) => d.p_value)) : 0, line: { color: "black", dash: "dash" } },
      { type: "line", x0: -foldChangeThreshold, x1: -foldChangeThreshold, y0: 0, y1: calculatedData ? Math.max(...calculatedData.map((d) => d.p_value)) : 0, line: { color: blue, dash: "dash" } },
      { type: "line", x0: foldChangeThreshold, x1: foldChangeThreshold, y0: 0, y1: calculatedData ? Math.max(...calculatedData.map((d) => d.p_value)) : 0, line: { color: blue, dash: "dash" } },
      { type: "line", x0: calculatedData ? -Math.max(...calculatedData.map((d) => Math.abs(d.fold_change))) : 0, x1: calculatedData ? Math.max(...calculatedData.map((d) => Math.abs(d.fold_change))) : 0, y0: -log10(pValueThreshold), y1: -log10(pValueThreshold), line: { color: red, dash: "dash" } },
    ],
  }

  const config: Partial<Config> = {
    scrollZoom: true,
    responsive: false, // do NOT make this true, the position of the plot would be strange when refreshing the page or the calculatedData changes
    displaylogo: false,
    displayModeBar: false,
    modeBarButtonsToRemove: ['toImage', 'lasso2d', 'pan2d', 'zoom2d', 'select2d'],
  }


  return (
    <div className="h-full">
      {calculatedData ? (
        <div className="px-4 pt-4 max-sm:px-0">
          <header className="flex items-center gap-2 pb-2 max-sm:pb-6">
            <h2 className="text-xl font-semibold">Volcano Plot</h2>
            <p className="font-light">
              (
              {currentlyDisplayedPlot.compareBetween}:&nbsp;
              {currentlyDisplayedPlot.group1 === 1 && 'High protein diet'}
              {currentlyDisplayedPlot.group1 === 3 && 'Low protein diet'}
              {currentlyDisplayedPlot.group1 === 'T1' && 'Control diet + no mannan'}
              {currentlyDisplayedPlot.group1 === 'T2' && 'Mannan'}
              {currentlyDisplayedPlot.group1 === 'LEBV' && 'Low Estimated Breeding Value'}
              {currentlyDisplayedPlot.group1 === 'HEBV' && 'High Estimated Breeding Value'}
              ,&nbsp;
              {currentlyDisplayedPlot.group2 === 1 && 'High protein diet'}
              {currentlyDisplayedPlot.group2 === 3 && 'Low protein diet'}
              {currentlyDisplayedPlot.group2 === 'T1' && 'Control diet + no mannan'}
              {currentlyDisplayedPlot.group2 === 'T2' && 'Mannan'}
              {currentlyDisplayedPlot.group2 === 'LEBV' && 'Low Estimated Breeding Value'}
              {currentlyDisplayedPlot.group2 === 'HEBV' && 'High Estimated Breeding Value'}
              )
            </p>
          </header>

          <div className="mb-4 flex gap-6 justify-center">
            <div>
              <label className="block text-xs font-medium text-center max-sm:text-2xs" htmlFor='foldChange'>Fold Change Threshold:</label>
              <input
                id="foldChange"
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={foldChangeThreshold}
                onChange={(e) => setFoldChangeThreshold(parseFloat(e.target.value))}
                className="w-full accent-burgundy"
              />
              <div className="text-xs text-center">{foldChangeThreshold.toFixed(1)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-center max-sm:text-2xs" htmlFor="pValue">p-value Threshold:</label>
              <input
                id="pValue"
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={pValueThreshold}
                onChange={(e) => setPValueThreshold(parseFloat(e.target.value))}
                className="w-full accent-burgundy"
              />
              <div className="text-xs text-center">{pValueThreshold.toFixed(3)}</div>
            </div>
          </div>

          <main className="w-fit mx-auto">
            <Plot
              data={data}
              layout={layout}
              config={config}
            />
          </main>

          <section className="hidden max-md:block">
            <div className="flex gap-4 items-center justify-center mt-4 mb-6 max-sm:gap-2">
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grey }}></div>
                <p className="text-xs">All Metabolites</p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: red }}></div>
                <p className="text-xs">Significant UP</p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: blue }}></div>
                <p className="text-xs">Significant DOWN</p>
              </div>
            </div>
          </section>

        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-[calc(100vh-222px)]
          max-xl:h-[calc(100vh-(var(--navbar-height)+200px))] 
          max-xl:text-center max-xl:px-20 
          max-sm:h-[calc(100vh-(var(--navbar-height)+48px+264px+32px+16px))]
          max-sm:px-4
          ">
          <p className="text-2xl font-semibold">Select target groups and click "Run Analysis" button to generate volcano plot.</p>
        </div>
      )
      }
    </div>
  );
};

export default VolcanoPlot;




