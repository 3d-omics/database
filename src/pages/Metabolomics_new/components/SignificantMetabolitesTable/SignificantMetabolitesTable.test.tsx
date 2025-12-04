import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import SignificantMetabolitesTable from "."

describe("Metabolomics page > SignificantMetabolitesTable component", () => {
  const baseData = [
    { metabolite: "A", fold_change: 2, p_value: 3, significant: true },
    { metabolite: "B", fold_change: -2.5, p_value: 4, significant: false },
    { metabolite: "C", fold_change: 1.2, p_value: 2, significant: true },
    { metabolite: "D", fold_change: 0.8, p_value: 1, significant: false },
  ]

  const defaultPropsBeforeCalculatedData = {
    calculatedData: null,
    pValueThreshold: 0.05,
    foldChangeThreshold: 1.5,
    executeCreatePlot: false,
  }

  const defaultProps = {
    calculatedData: baseData,
    pValueThreshold: 0.05,
    foldChangeThreshold: 1.5,
    executeCreatePlot: false,
  }

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("renders table when calculatedData is present", () => {
    //before calculatedData is set
    render(<SignificantMetabolitesTable {...defaultPropsBeforeCalculatedData} />)
    expect(screen.queryByTestId("significant-metabolites-table")).not.toBeInTheDocument()
    expect(screen.queryByText("Metabolite")).not.toBeInTheDocument()
    expect(screen.queryByText("Fold Change")).not.toBeInTheDocument()
    expect(screen.queryByText("P-Value")).not.toBeInTheDocument()
    expect(screen.queryByText("Significant")).not.toBeInTheDocument()
    // after calculatedData is set
    render(<SignificantMetabolitesTable {...defaultProps} />)
    expect(screen.getByTestId("significant-metabolites-table")).toBeInTheDocument()
    expect(screen.getByText("Metabolite")).toBeInTheDocument()
    expect(screen.getByText("Fold Change")).toBeInTheDocument()
    expect(screen.getByText("P-Value")).toBeInTheDocument()
    expect(screen.getByText("Significant")).toBeInTheDocument()
  })




  it("renders correct number of rows (<=30 by default)", () => {
    const manyRows = Array.from({ length: 45 }, (_, i) => ({
      metabolite: `M${i}`,
      fold_change: 2 + i,
      p_value: 3 + i,
      significant: true,
    }))
    render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={manyRows}
      />
    )
    expect(screen.getAllByRole("row")).toHaveLength(31) // 1 header + 10 data
  })



  it("shows 'Load more' button if more rows exist", () => {
    const manyRows = Array.from({ length: 45 }, (_, i) => ({
      metabolite: `M${i}`,
      fold_change: 2 + i,
      p_value: 3 + i,
      significant: true,
    }))
    render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={manyRows}
      />
    )
    expect(screen.getByText(/Load more/i)).toBeInTheDocument()
  })


  it("does not show 'Load more' button if no more rows to display exists", () => {
    const manyRows = Array.from({ length: 25 }, (_, i) => ({
      metabolite: `M${i}`,
      fold_change: 2 + i,
      p_value: 3 + i,
      significant: true,
    }))
    render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={manyRows}
      />
    )
    expect(screen.queryByText(/Load more/i)).not.toBeInTheDocument()
  })




  it("loads more rows when 'Load more' is clicked", () => {
    const manyRows = Array.from({ length: 55 }, (_, i) => ({
      metabolite: `M${i}`,
      fold_change: 2 + i,
      p_value: 3 + i,
      significant: true,
    }))
    render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={manyRows}
      />
    )
    fireEvent.click(screen.getByText(/Load more/i))
    expect(screen.getAllByRole("row")).toHaveLength(41)  // Now 30 default rows + 10 new rows + 1 header
    fireEvent.click(screen.getByText(/Load more/i))
    expect(screen.getAllByRole("row")).toHaveLength(51)  // Now 30 default rows + 20 new rows + 1 header

  })





  it("shows empty table if calculatedData is null", () => {
    render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={null}
      />
    )
    // Table should not be rendered
    expect(screen.queryByTestId("significant-metabolites-table")).not.toBeInTheDocument()
  })






  it("shows correct 'Significant' label based on thresholds", () => {
    const testData = [
      { metabolite: "A", fold_change: 3.34, p_value: 8.41, significant: true },
      { metabolite: "B", fold_change: -1.02, p_value: 1.2, significant: false },
      { metabolite: "C", fold_change: -0.26, p_value: 0.31, significant: false },
      { metabolite: "D", fold_change: 1.63, p_value: 2.12, significant: true },
    ]
    render(
      <SignificantMetabolitesTable
        // {...defaultProps}
        calculatedData={testData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={true}
      />
    )
    expect(screen.getAllByText("Yes")).toHaveLength(2)
  })






  it("resets displayedRows to 30 when executeCreatePlot changes", () => {
    const { rerender } = render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={Array.from({ length: 40 }, (_, i) => ({
          metabolite: `M${i}`,
          fold_change: 2 + i,
          p_value: 3 + i,
          significant: true,
        }))}
        executeCreatePlot={false}
      />
    )

    expect(screen.getAllByRole("row")).toHaveLength(31) // Default is 30 rows + header
    fireEvent.click(screen.getByText(/Load more/i))
    expect(screen.getAllByRole("row")).toHaveLength(41) // Now 30 default rows + 10 new rows + 1 header

    rerender(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={Array.from({ length: 40 }, (_, i) => ({
          metabolite: `M${i}`,
          fold_change: 2 + i,
          p_value: 3 + i,
          significant: true,
        }))}
        executeCreatePlot={true}
      />
    )
    expect(screen.getAllByRole("row")).toHaveLength(31) // After rerender, should show 30 rows + header
  })





  it("sorts rows by absolute fold_change descending", () => {
    const testData = [
      { metabolite: "A", fold_change: -5, p_value: 3, significant: true },
      { metabolite: "B", fold_change: 2, p_value: 3, significant: true },
      { metabolite: "C", fold_change: 10, p_value: 3, significant: true },
    ]
    render(
      <SignificantMetabolitesTable
        {...defaultProps}
        calculatedData={testData}
      />
    )
    const rows = screen.getAllByRole("row")
    expect(rows[1]).toHaveTextContent("C") // First data row should be C (fold_change 10)
    expect(rows[2]).toHaveTextContent("A") // Second should be A (abs(-5) = 5)
    expect(rows[3]).toHaveTextContent("B") // Third should be B (abs(2) = 2)
  })
})