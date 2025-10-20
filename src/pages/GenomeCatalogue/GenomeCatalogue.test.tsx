import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi, Mock } from 'vitest'
import GenomeCatalogue from 'pages/GenomeCatalogue'
import useFetchExcelFileData from 'hooks/useFetchExcelFileData'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import { useParams } from 'react-router-dom'
import { airtableConfig } from 'config/airtable'
import * as LoadingModule from 'components/Loading'
import * as NotFoundModule from 'pages/NotFound'
import * as ErrorBannerModule from 'components/ErrorBanner'
import * as PhyloCircosPlotModule from './components/PhyloCircosPlot'
import * as TableModule from './components/Table'
import TestRouter from 'tests/setup/test-utils'


// ----------------- MOCKS -----------------
vi.mock('hooks/useFetchExcelFileData')
vi.mock('hooks/useGetFirst100Data')
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom')
  return { ...actual, useParams: vi.fn() }
})
vi.mock('config/airtable')
vi.mock('./components/Table')
vi.mock('./components/PhyloCircosPlot')
vi.mock('components/Loading')
vi.mock('pages/NotFound')
vi.mock('components/ErrorBanner')

const mockUseFetchExcelFileData = useFetchExcelFileData as unknown as Mock
const mockUseGetFirst100Data = useGetFirst100Data as unknown as Mock
const mockUseParams = useParams as unknown as Mock

const renderGenomeCatalogue = () => {
  render(
    <TestRouter>
      <GenomeCatalogue />
    </TestRouter>
  )
}

describe('GenomeCatalogue page', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseParams.mockReturnValue({ experimentName: 'test-experiment' })

    mockUseFetchExcelFileData.mockReturnValue({
      fetchExcel: vi.fn().mockResolvedValue({
        genome: ['genome1', 'genome2'],
        phylum: ['p__phylum1', 'p__phylum2'],
        completeness: [90, 95],
        contamination: [5, 3],
        length: [5000, 6000],
        N50: [20, 30],
        domain: ['d__domain1', 'd__domain2'],
        class: ['c__class1', 'c__class2'],
        order: ['o__order1', 'o__order2'],
        family: ['f__family1', 'f__family2'],
        genus: ['g__genus1', 'g__genus2'],
        species: ['s__species1', 's__species2'],
      }),
      fetchExcelError: null,
    })

    mockUseGetFirst100Data.mockReturnValue({
      allData: [{ name: 'test-experiment' }],
      allLoading: false,
      allError: null,
      hasFetchedAllData: true,
    })

      (airtableConfig as unknown as { animalTrialExperimentBaseId: string; animalTrialExperimentTableId: string; animalTrialExperimentViewId: string; }).animalTrialExperimentBaseId = 'baseId';
    (airtableConfig as unknown as { animalTrialExperimentBaseId: string; animalTrialExperimentTableId: string; animalTrialExperimentViewId: string; }).animalTrialExperimentTableId = 'tableId';
    (airtableConfig as unknown as { animalTrialExperimentBaseId: string; animalTrialExperimentTableId: string; animalTrialExperimentViewId: string; }).animalTrialExperimentViewId = 'viewId';
  })




  test('renders loading state', async () => {
    mockUseGetFirst100Data.mockReturnValue({
      allData: [],
      allLoading: true,
      allError: null,
    })

    render(<GenomeCatalogue />)
    expect(await screen.findByTestId('loading-dots-wrapper')).toBeInTheDocument()
  })




  test('renders NotFound when experiment does not exist', async () => {
    mockUseGetFirst100Data.mockReturnValue({
      allData: [],
      allLoading: false,
      allError: null,
      hasFetchedAllData: true,
    })

    const NotFoundSpy = vi.spyOn(NotFoundModule, 'default')
    render(<GenomeCatalogue />)
    await waitFor(() => {
      expect(NotFoundSpy).toHaveBeenCalled()
    })
  })




  test('renders ErrorBanner on fetchExcelError', () => {
    mockUseFetchExcelFileData.mockReturnValue({
      fetchExcel: vi.fn(),
      fetchExcelError: 'Excel fetch failed',
    })

    const ErrorBanner = ErrorBannerModule.default
    renderGenomeCatalogue()
    expect(ErrorBanner).toHaveBeenCalled()
  })




  test('renders PhyloCircosPlot and Table on success', async () => {
    renderGenomeCatalogue()
    const PhyloCircosPlot = PhyloCircosPlotModule.default
    const Table = TableModule.default

    // Header text check
    expect(await screen.findByText('test-experiment MAG Catalogue')).toBeInTheDocument()

    // Child components called
    expect(PhyloCircosPlot).toHaveBeenCalled()
    expect(Table).toHaveBeenCalled()
  })




  test('handles incorrect metadata gracefully', async () => {
    mockUseFetchExcelFileData.mockReturnValue({
      fetchExcel: vi.fn().mockResolvedValue({
        genome: [],
        phylum: [],
        completeness: [],
        contamination: [],
        length: [],
        N50: [],
        domain: [],
        class: [],
        order: [],
        family: [],
        genus: [],
        species: [],
      }),
      fetchExcelError: null,
    })

    renderGenomeCatalogue()
    const PhyloCircosPlot = PhyloCircosPlotModule.default
    await waitFor(() => {
      expect(PhyloCircosPlot).toHaveBeenCalled()
    })
  })

})
