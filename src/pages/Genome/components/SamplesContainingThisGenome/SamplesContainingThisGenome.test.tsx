import { render, screen, fireEvent } from "@testing-library/react"
import { vi, Mock } from "vitest"
import SamplesContainingThisGenome from "."
import { useGenomeJsonFile, useAllMicrosampleCounts } from 'hooks/useJsonData'
import { useParams } from 'react-router-dom'

// Mock the hooks
vi.mock("hooks/useJsonData")
vi.mock("react-router-dom")

const mockUseGenomeJsonFile = useGenomeJsonFile as Mock
const mockUseAllMicrosampleCounts = useAllMicrosampleCounts as Mock
const mockUseParams = useParams as Mock

describe("Genome page > SamplesContainingThisGenome", () => {
  beforeEach(() => {
    // Default mock for useParams
    mockUseParams.mockReturnValue({ experimentName: 'A_experiment' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders tabs for Macrosample and Microsample", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    expect(screen.getByText('Macrosample')).toBeInTheDocument()
    expect(screen.getByText('Microsample')).toBeInTheDocument()
  })



  it("renders error banner if macro data fails to load", () => {
    mockUseGenomeJsonFile.mockReturnValue(null) // No data = error
    mockUseAllMicrosampleCounts.mockReturnValue([
      { data: { genome: [], M301570: [] } }
    ])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    expect(screen.getByText(/Failed to load macrosample data/i)).toBeInTheDocument()
  })



  it("renders error banner if micro data fails to load", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([]) // Empty array = error

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    // Switch to Microsample tab
    fireEvent.click(screen.getByText('Microsample'))

    expect(screen.getByText(/Failed to load microsample data/i)).toBeInTheDocument()
  })



  it("renders 'No macrosamples' message if genome not found in macro data", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['OTHER:bin_001', 'ANOTHER:bin_002'],
      M301570: [0.5, 0.7],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([
      { data: { genome: [], M301570: [] } }
    ])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    expect(screen.getByText(/No macrosamples containing/i)).toBeInTheDocument()
    expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
    expect(screen.getByText(/were found/i)).toBeInTheDocument()
  })



  it("renders 'No microsamples' message if genome not found in micro data", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([
      {
        data: {
          genome: ['OTHER:bin_001'],
          M301570: [0.5],
        }
      }
    ])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    // Switch to Microsample tab
    fireEvent.click(screen.getByText('Microsample'))

    expect(screen.getByText(/No microsamples containing/i)).toBeInTheDocument()
    expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
    expect(screen.getByText(/were found/i)).toBeInTheDocument()
  })



  it("renders table with macrosamples when genome is found", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['TG2:bin_000003', 'GPB:bin_000056'],
      M301570: [0.177, 0.259],
      M301571: [0.5, 0.3],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([
      { data: { genome: [] } }
    ])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/macrosamples containing/i)).toBeInTheDocument()
    expect(screen.getByText('TG2:bin_000003')).toBeInTheDocument()
    expect(screen.getByText('M301570')).toBeInTheDocument()
    expect(screen.getByText('0.177')).toBeInTheDocument()
    expect(screen.getByText('M301571')).toBeInTheDocument()
    expect(screen.getByText('0.5')).toBeInTheDocument()
  })



  it("renders table with microsamples when genome is found across multiple files", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([
      {
        data: {
          genome: ['TG2:bin_000003', 'OTHER:bin_001'],
          MICRO001: [1.5, 0.3],
          MICRO002: [2.1, 0.4],
        }
      },
      {
        data: {
          genome: ['TG2:bin_000003'],
          MICRO003: [3.7],
        }
      },
      {
        data: {
          genome: ['ANOTHER:bin_002'], // No match
          MICRO004: [0.9],
        }
      }
    ])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    // Switch to Microsample tab
    fireEvent.click(screen.getByText('Microsample'))

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText(/microsamples containing/i)).toBeInTheDocument()
    expect(screen.getByText('MICRO001')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument()
    expect(screen.getByText('MICRO002')).toBeInTheDocument()
    expect(screen.getByText('2.1')).toBeInTheDocument()
    expect(screen.getByText('MICRO003')).toBeInTheDocument()
    expect(screen.getByText('3.7')).toBeInTheDocument()
  })



  it("switches between tabs correctly", () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['TG2:bin_000003'],
      MACRO001: [0.5],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([
      {
        data: {
          genome: ['TG2:bin_000003'],
          MICRO001: [1.5],
        }
      }
    ])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    // Initially on Macrosample tab
    expect(screen.getByText(/macrosample containing/i)).toBeInTheDocument()
    expect(screen.getByText('MACRO001')).toBeInTheDocument()

    // Switch to Microsample tab
    fireEvent.click(screen.getByText('Microsample'))
    expect(screen.getByText(/microsample containing/i)).toBeInTheDocument()
    expect(screen.getByText('MICRO001')).toBeInTheDocument()
    expect(screen.queryByText('MACRO001')).not.toBeInTheDocument()

    // Switch back to Macrosample tab
    fireEvent.click(screen.getByText('Macrosample'))
    expect(screen.getByText(/macrosample containing/i)).toBeInTheDocument()
    expect(screen.getByText('MACRO001')).toBeInTheDocument()
    expect(screen.queryByText('MICRO001')).not.toBeInTheDocument()
  })



  it("uses correct experiment ID from params", () => {
    mockUseParams.mockReturnValue({ experimentName: 'B_experiment' })
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
    })
    mockUseAllMicrosampleCounts.mockReturnValue([])

    render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

    // Verify useGenomeJsonFile was called with correct experiment ID
    expect(mockUseGenomeJsonFile).toHaveBeenCalledWith(
      'macro_genome_counts',
      'experiment_B_counts'
    )
  })
})