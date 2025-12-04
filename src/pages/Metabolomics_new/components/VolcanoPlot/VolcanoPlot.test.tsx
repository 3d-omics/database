import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import VolcanoPlot from "."

// Mock external libs
vi.mock("mathjs", () => ({
  log10: vi.fn((x) => Math.log10(x)),
  log2: vi.fn((x) => Math.log2(x)),
}))
vi.mock("xlsx", () => ({
  read: vi.fn(() => ({
    Sheets: {
      "Abundances": {},
      "Sample metadata": {},
      "Swine trial annotated list": {},
    }
  })),
  utils: {
    sheet_to_json: vi.fn(() => []),
  },
}))
vi.mock("jstat", () => ({
  mean: vi.fn(() => 1),
  sum: vi.fn(() => 1),
  pow: vi.fn(() => [1]),
  subtract: vi.fn(() => [1]),
  studentt: {
    cdf: vi.fn(() => 0.05),
  },
}))

// Mock fetch for excel file
global.fetch = vi.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob()),
  })
) as any

// Mock FileReader
class MockFileReader {
  onload: ((e: any) => void) | null = null
  readAsBinaryString = vi.fn(() => {
    if (this.onload) {
      this.onload({ target: { result: "" } })
    }
  })
}
global.FileReader = MockFileReader as any

describe("Metabolomics page > VolcanoPlot component", () => {
  const setCompareBetween = vi.fn()
  const setGroup1 = vi.fn()
  const setGroup2 = vi.fn()
  const setExecuteCreatePlot = vi.fn()
  const setCalculatedData = vi.fn()
  const setPValueThreshold = vi.fn()
  const setFoldChangeThreshold = vi.fn()

  const defaultProps = {
    compareBetween: "Diet",
    group1: "1",
    group2: "3",
    executeCreatePlot: false,
    setExecuteCreatePlot,
    calculatedData: null,
    setCalculatedData,
    pValueThreshold: 0.05,
    foldChangeThreshold: 1.5,
    setPValueThreshold,
    setFoldChangeThreshold,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders instruction when no data', () => {
    render(<VolcanoPlot {...defaultProps} />)
    expect(screen.getByText(/Select target groups and click "Run Analysis"/)).toBeInTheDocument()
  })



  it('renders volcano plot and controls when calculatedData is present', () => {
    render(
      <VolcanoPlot
        {...defaultProps}
        calculatedData={[
          { metabolite: "A", fold_change: 2, p_value: 3, significant: true },
          { metabolite: "B", fold_change: -2, p_value: 4, significant: false },
        ]}
      />
    )
    expect(screen.getByText("Volcano Plot")).toBeInTheDocument()
    expect(screen.getByLabelText(/Fold Change Threshold/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/p-value Threshold/i)).toBeInTheDocument()
  })




  it('calls setFoldChangeThreshold when fold change slider is changed', () => {
    render(
      <VolcanoPlot
        {...defaultProps}
        calculatedData={[
          { metabolite: "A", fold_change: 2, p_value: 3, significant: true },
        ]}
      />
    )
    const slider = screen.getByLabelText(/Fold Change Threshold/i)
    fireEvent.change(slider, { target: { value: "2.0" } })
    expect(setFoldChangeThreshold).toHaveBeenCalledWith(2.0)
  })




  it('calls setPValueThreshold when p-value slider is changed', () => {
    render(
      <VolcanoPlot
        {...defaultProps}
        calculatedData={[
          { metabolite: "A", fold_change: 2, p_value: 3, significant: true },
        ]}
      />
    )
    const slider = screen.getByLabelText(/p-value Threshold/i)
    fireEvent.change(slider, { target: { value: "0.01" } })
    expect(setPValueThreshold).toHaveBeenCalledWith(0.01)
  })




  it('fetches and processes data when executeCreatePlot is true', async () => {
    render(<VolcanoPlot {...defaultProps} executeCreatePlot={true} />)
    await waitFor(() => {
      expect(setExecuteCreatePlot).toHaveBeenCalledWith(false)
    })
  })



  it('displays correct group names in header', async () => {
    render(
      <VolcanoPlot
        {...defaultProps}
        executeCreatePlot={true}
        calculatedData={[
          { metabolite: "A", fold_change: 2, p_value: 3, significant: true },
        ]}
      />
    )
    expect(await screen.findByText(/High protein diet/)).toBeInTheDocument()
    expect(await screen.findByText(/Low protein diet/)).toBeInTheDocument()
  })
})
