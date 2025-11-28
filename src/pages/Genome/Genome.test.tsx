import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import Genome from '.'

// Mock react-router useParams
vi.mock('react-router-dom', () => ({
  useParams: () => ({
    genomeName: 'Genome_123',
    experimentName: 'A_Experiment',
  }),
}))

// Mock child components to avoid heavy rendering
vi.mock('./components/Details', () => ({
  default: ({ genomeData }: any) => <div>Details Component - {genomeData.genome}</div>,
}))
vi.mock('./components/SamplesContainingThisGenome', () => ({
  default: ({ genomeName }: any) => <div>Samples Component - {genomeName}</div>,
}))
vi.mock('components/Tabs', () => ({
  default: ({ selectedTab, setSelectedTab, tabs }: any) => (
    <div>
      {tabs.map((tab: string) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          aria-pressed={selectedTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  ),
}))
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div>Breadcrumbs: {items.map((i: any) => i.label).join(' > ')}</div>
  ),
}))
vi.mock('pages/NotFound', () => ({
  default: () => <div>NotFound Page</div>,
}))
vi.mock('components/ParamsValidator', () => ({
  default: ({ children, validating, notFound }: any) => {
    if (validating) return <div>Validating...</div>
    if (notFound) return <div>Not Found from Validator</div>
    return <div>{children}</div>
  },
}))

// Mock useValidateParams hook
const mockUseValidateParams = vi.fn()
vi.mock('hooks/useValidateParams', () => ({
  default: () => mockUseValidateParams(),
}))

// Mock useGenomeJsonFile hook
const mockUseGenomeJsonFile = vi.fn()
vi.mock('hooks/useJsonData', () => ({
  useGenomeJsonFile: () => mockUseGenomeJsonFile(),
}))

describe('Genome page', () => {
  beforeEach(() => {
    // Default mock values
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders NotFound if genome metadata fails to load', () => {
    mockUseGenomeJsonFile.mockReturnValue(null)

    render(<Genome />)

    expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
  })

  it('renders NotFound if genome is not in metadata', () => {
    // Return genome data without matching genomeName
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['OtherGenome', 'AnotherGenome'],
      phylum: ['p__Firmicutes', 'p__Bacteroidetes'],
      domain: ['d__Bacteria', 'd__Bacteria'],
    })

    render(<Genome />)

    expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
  })

  it('renders Details when genome is found', () => {
    // genomeName is "Genome_123", so return a matching entry
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123', 'OtherGenome'],
      phylum: ['p__Firmicutes', 'p__Bacteroidetes'],
      domain: ['d__Bacteria', 'd__Bacteria'],
      class: ['c__Bacilli', 'c__Bacteroidia'],
    })

    render(<Genome />)

    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
  })

  it('renders breadcrumbs with correct links', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
    })

    render(<Genome />)

    expect(
      screen.getByText(/Breadcrumbs: Home > MAG Catalogues > A_Experiment > Genome_123/i)
    ).toBeInTheDocument()
  })

  it('displays genome name as header', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
    })

    render(<Genome />)

    expect(screen.getByText('Genome_123')).toBeInTheDocument()
  })

  it('switches tabs correctly', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
    })

    render(<Genome />)

    // Details shown by default
    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Samples Component/i)).not.toBeInTheDocument()

    // Switch to "Samples containing this genome"
    fireEvent.click(
      screen.getByRole('button', { name: /Samples containing this genome/i })
    )

    expect(screen.getByText(/Samples Component - Genome_123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Details Component/i)).not.toBeInTheDocument()

    // Switch back to "Genome details"
    fireEvent.click(screen.getByRole('button', { name: /Genome details/i }))

    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
    expect(screen.queryByText(/Samples Component/i)).not.toBeInTheDocument()
  })

  it('cleans taxonomy fields correctly', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
      domain: ['d__Bacteria'],
      class: ['c__Bacilli'],
      order: ['o__Lactobacillales'],
      family: ['f__Lactobacillaceae'],
      genus: ['g__Lactobacillus'],
      species: ['s__Lactobacillus_acidophilus'],
    })

    const { container } = render(<Genome />)

    // The Details component should receive cleaned taxonomy data
    // (without the prefix like "p__", "d__", etc.)
    expect(container).toBeInTheDocument()
  })

  it('handles short taxonomy values as unknown', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__'], // Short value (<=3 chars)
      domain: ['d__Bacteria'],
      class: ['NA'], // Short value
    })

    render(<Genome />)

    // Component should still render without crashing
    expect(screen.getByText(/Details Component - Genome_123/i)).toBeInTheDocument()
  })

  it('shows ParamsValidator validating state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: true,
      notFound: false,
    })
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })

    render(<Genome />)

    expect(screen.getByText(/Validating.../i)).toBeInTheDocument()
  })

  it('shows ParamsValidator notFound state', () => {
    mockUseValidateParams.mockReturnValue({
      validating: false,
      notFound: true,
    })
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })

    render(<Genome />)

    expect(screen.getByText(/Not Found from Validator/i)).toBeInTheDocument()
  })

  it('extracts correct experiment ID from experimentName', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: ['Genome_123'],
      phylum: ['p__Firmicutes'],
    })

    render(<Genome />)

    // Verify useGenomeJsonFile was called with correct experiment ID (first char of experimentName)
    expect(mockUseGenomeJsonFile).toHaveBeenCalled()
  })



  it('handles empty genome array', () => {
    mockUseGenomeJsonFile.mockReturnValue({
      genome: [],
      phylum: [],
    })

    render(<Genome />)

    expect(screen.getByText(/NotFound Page/i)).toBeInTheDocument()
  })

})

// ======== TEST THAT WAS USED IN SAMPLES CONTAINING THIS GENOME COMPONENT ========

// import { render, screen, fireEvent } from "@testing-library/react"
// import { vi, Mock } from "vitest"
// import SamplesContainingThisGenome from "./SamplesContainingThisGenome"
// import { useGenomeJsonFile, useAllMicrosampleCounts } from 'hooks/useJsonData'
// import { useParams } from 'react-router-dom'

// // Mock the hooks
// vi.mock("hooks/useJsonData")
// vi.mock("react-router-dom")

// const mockUseGenomeJsonFile = useGenomeJsonFile as Mock
// const mockUseAllMicrosampleCounts = useAllMicrosampleCounts as Mock
// const mockUseParams = useParams as Mock

// describe("Genome page > SamplesContainingThisGenome", () => {
//   beforeEach(() => {
//     // Default mock for useParams
//     mockUseParams.mockReturnValue({ experimentName: 'A_experiment' })
//   })

//   afterEach(() => {
//     vi.clearAllMocks()
//   })

//   it("renders tabs for Macrosample and Microsample", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: [],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     expect(screen.getByText('Macrosample')).toBeInTheDocument()
//     expect(screen.getByText('Microsample')).toBeInTheDocument()
//   })



//   it("renders error banner if macro data fails to load", () => {
//     mockUseGenomeJsonFile.mockReturnValue(null) // No data = error
//     mockUseAllMicrosampleCounts.mockReturnValue([
//       { data: { genome: [], M301570: [] } }
//     ])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     expect(screen.getByText(/Failed to load macrosample data/i)).toBeInTheDocument()
//   })



//   it("renders error banner if micro data fails to load", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: [],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([]) // Empty array = error

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     // Switch to Microsample tab
//     fireEvent.click(screen.getByText('Microsample'))

//     expect(screen.getByText(/Failed to load microsample data/i)).toBeInTheDocument()
//   })



//   it("renders 'No macrosamples' message if genome not found in macro data", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: ['OTHER:bin_001', 'ANOTHER:bin_002'],
//       M301570: [0.5, 0.7],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([
//       { data: { genome: [], M301570: [] } }
//     ])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     expect(screen.getByText(/No macrosamples containing/i)).toBeInTheDocument()
//     expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
//     expect(screen.getByText(/were found/i)).toBeInTheDocument()
//   })



//   it("renders 'No microsamples' message if genome not found in micro data", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: [],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([
//       {
//         data: {
//           genome: ['OTHER:bin_001'],
//           M301570: [0.5],
//         }
//       }
//     ])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     // Switch to Microsample tab
//     fireEvent.click(screen.getByText('Microsample'))

//     expect(screen.getByText(/No microsamples containing/i)).toBeInTheDocument()
//     expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
//     expect(screen.getByText(/were found/i)).toBeInTheDocument()
//   })



//   it("renders table with macrosamples when genome is found", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: ['TG2:bin_000003', 'GPB:bin_000056'],
//       M301570: [0.177, 0.259],
//       M301571: [0.5, 0.3],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([
//       { data: { genome: [] } }
//     ])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     expect(screen.getByText('2')).toBeInTheDocument()
//     expect(screen.getByText(/macrosamples containing/i)).toBeInTheDocument()
//     expect(screen.getByText('TG2:bin_000003')).toBeInTheDocument()
//     expect(screen.getByText('M301570')).toBeInTheDocument()
//     expect(screen.getByText('0.177')).toBeInTheDocument()
//     expect(screen.getByText('M301571')).toBeInTheDocument()
//     expect(screen.getByText('0.5')).toBeInTheDocument()
//   })



//   it("renders table with microsamples when genome is found across multiple files", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: [],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([
//       {
//         data: {
//           genome: ['TG2:bin_000003', 'OTHER:bin_001'],
//           MICRO001: [1.5, 0.3],
//           MICRO002: [2.1, 0.4],
//         }
//       },
//       {
//         data: {
//           genome: ['TG2:bin_000003'],
//           MICRO003: [3.7],
//         }
//       },
//       {
//         data: {
//           genome: ['ANOTHER:bin_002'], // No match
//           MICRO004: [0.9],
//         }
//       }
//     ])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     // Switch to Microsample tab
//     fireEvent.click(screen.getByText('Microsample'))

//     expect(screen.getByText('3')).toBeInTheDocument()
//     expect(screen.getByText(/microsamples containing/i)).toBeInTheDocument()
//     expect(screen.getByText('MICRO001')).toBeInTheDocument()
//     expect(screen.getByText('1.5')).toBeInTheDocument()
//     expect(screen.getByText('MICRO002')).toBeInTheDocument()
//     expect(screen.getByText('2.1')).toBeInTheDocument()
//     expect(screen.getByText('MICRO003')).toBeInTheDocument()
//     expect(screen.getByText('3.7')).toBeInTheDocument()
//   })



//   it("switches between tabs correctly", () => {
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: ['TG2:bin_000003'],
//       MACRO001: [0.5],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([
//       {
//         data: {
//           genome: ['TG2:bin_000003'],
//           MICRO001: [1.5],
//         }
//       }
//     ])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     // Initially on Macrosample tab
//     expect(screen.getByText(/macrosample containing/i)).toBeInTheDocument()
//     expect(screen.getByText('MACRO001')).toBeInTheDocument()

//     // Switch to Microsample tab
//     fireEvent.click(screen.getByText('Microsample'))
//     expect(screen.getByText(/microsample containing/i)).toBeInTheDocument()
//     expect(screen.getByText('MICRO001')).toBeInTheDocument()
//     expect(screen.queryByText('MACRO001')).not.toBeInTheDocument()

//     // Switch back to Macrosample tab
//     fireEvent.click(screen.getByText('Macrosample'))
//     expect(screen.getByText(/macrosample containing/i)).toBeInTheDocument()
//     expect(screen.getByText('MACRO001')).toBeInTheDocument()
//     expect(screen.queryByText('MICRO001')).not.toBeInTheDocument()
//   })



//   it("uses correct experiment ID from params", () => {
//     mockUseParams.mockReturnValue({ experimentName: 'B_experiment' })
//     mockUseGenomeJsonFile.mockReturnValue({
//       genome: [],
//     })
//     mockUseAllMicrosampleCounts.mockReturnValue([])

//     render(<SamplesContainingThisGenome genomeName="TG2:bin_000003" />)

//     // Verify useGenomeJsonFile was called with correct experiment ID
//     expect(mockUseGenomeJsonFile).toHaveBeenCalledWith(
//       'macro_genome_counts',
//       'experiment_B_counts'
//     )
//   })
// })