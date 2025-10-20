import { render, screen, waitFor } from "@testing-library/react"
import { vi, Mock } from "vitest"
import SamplesContainingThisGenome from "."
import useFetchExcelFileData from "hooks/useFetchExcelFileData"

// Mock the hook
vi.mock("hooks/useFetchExcelFileData")

const mockUseFetchExcelFileData = useFetchExcelFileData as Mock

describe("Genome page > SamplesContainingThisGenome", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })



it("renders error banner if hook returns error", async () => {
  // Default: always return safe object
  mockUseFetchExcelFileData.mockImplementation(() => ({
    fetchExcel: vi.fn().mockResolvedValue({}), // safe default promise
    fetchExcelError: null,
  }))

  // First call returns error
  mockUseFetchExcelFileData.mockReturnValueOnce({
    fetchExcel: vi.fn().mockResolvedValue({}), // still async safe
    fetchExcelError: "Failed to fetch file 1",
  })

  render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

  // Let React flush effects (because useEffect always fires)
  await waitFor(() => {
    expect(
      screen.getByText(/Failed to fetch file 1/i)
    ).toBeInTheDocument()
  })
})




  it("renders 'No samples' message if no genome found", async () => {
    mockUseFetchExcelFileData
      .mockReturnValueOnce({
        fetchExcel: vi.fn().mockResolvedValue({ genome: [], M301570: [] }),
        fetchExcelError: null,
      })
      .mockReturnValueOnce({
        fetchExcel: vi.fn().mockResolvedValue({ genome: [], M301570: [] }),
        fetchExcelError: null,
      })
      .mockReturnValue({
        fetchExcel: vi.fn().mockResolvedValue({ genome: [], sampleX: [] }),
        fetchExcelError: null,
      });

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    expect(await screen.findByText(/No samples containing/i)).toBeInTheDocument()
    expect(await screen.findByText(/TG2:bin_000003/i)).toBeInTheDocument()
    expect(await screen.findByText(/were found/i)).toBeInTheDocument()
  });




  it("renders table with microsamples when genome is found", async () => {
    // Mock fetchExcel for both calls, one contains TG2:bin_000003
    mockUseFetchExcelFileData
      .mockReturnValueOnce({
        fetchExcel: vi.fn().mockResolvedValue({
          genome: ["TG2:bin_000003", "GPB:bin_000056"],
          M301570: [0.177, 0.259], // TG2:bin_000003 -> 0.177, GPB:bin_000056 -> 0.259
        }),
        fetchExcelError: null,
      })
      .mockReturnValueOnce({
        fetchExcel: vi.fn().mockResolvedValue({
          genome: ["D300418:bin_000001"],
          M301570: [17.8], // different genome, not TG2:bin_000003
        }),
        fetchExcelError: null,
      });

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />);

    // expect(await screen.findByText('asdf')).toBeInTheDocument()
    expect(await screen.findByText(/sample containing/i)).toBeInTheDocument() // '1 sample containing GenomeX'
    expect(await screen.findByTestId('table')).toBeInTheDocument()
    expect(await screen.findByText("M301570")).toBeInTheDocument();
    expect(await screen.findByText("0.177")).toBeInTheDocument();
  })

})
