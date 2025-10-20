import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi, Mock } from 'vitest'
import { useParams } from 'react-router-dom'
import useGetFirst100Data from 'hooks/useGetFirst100Data'
import AnimalTrialOverview from './index'


//  mock before importing component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>
  }
})

vi.mock('hooks/useGetFirst100Data', () => ({
  default: vi.fn(),
}))



describe('AnimalTrialOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading indicator when loading', () => {
    (useParams as Mock).mockReturnValue({ experimentName: 'Test Experiment' });
    (useGetFirst100Data as Mock).mockReturnValue({
      allData: [],
      allLoading: true,
      allError: null,
      hasFetchedAllData: false,
    })

    render(<AnimalTrialOverview />)

    expect(screen.getByTestId('loading-dots')).toBeInTheDocument()
  })




  it('renders page 404 when data is empty after fetch', () => {
    (useParams as Mock).mockReturnValue({ experimentName: 'Test Experiment' })
      ; (useGetFirst100Data as Mock).mockReturnValue({
        allData: [],
        allLoading: false,
        allError: null,
        hasFetchedAllData: true,
      })

    render(<AnimalTrialOverview />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })



  it('renders error banner when error occurs', () => {
    (useParams as Mock).mockReturnValue({ experimentName: 'Test Experiment' })
      ; (useGetFirst100Data as Mock).mockReturnValue({
        allData: undefined,
        allLoading: false,
        allError: 'Some error',
        hasFetchedAllData: true,
      })

    render(<AnimalTrialOverview />)
    expect(screen.getByText('Error! Something went wrong. Please try again.')).toBeInTheDocument()
  })




  it('renders main content and tabs when data is available', () => {
    (useParams as Mock).mockReturnValue({ experimentName: 'B - Proof-of-principle chicken trial A' })
      ; (useGetFirst100Data as Mock).mockReturnValue({
        allData: [{ fields: { ID: '123', StartDate: '2023-01-01', EndDate: '2023-02-01' } }],
        allLoading: false,
        allError: null,
        hasFetchedAllData: true,
      })

    render(<AnimalTrialOverview />)
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getAllByText('B - Proof-of-principle chicken trial A')).toHaveLength(2)
    expect(screen.getByText('view MAG Catalogue')).toBeInTheDocument()
    expect(screen.getByText(/Experiment ID:/)).toBeInTheDocument()
    expect(screen.getByText(/Start date:/)).toBeInTheDocument()
    expect(screen.getByText(/2023-01-01/)).toBeInTheDocument()
    expect(screen.getByText(/End date:/)).toBeInTheDocument()
    expect(screen.getByText(/2023-02-01/)).toBeInTheDocument()
  })




  it('switches tabs when tab buttons are clicked', () => {
    (useParams as Mock).mockReturnValue({ experimentName: 'B - Proof-of-principle chicken trial A' })
      ; (useGetFirst100Data as Mock).mockReturnValue({
        allData: [{ fields: { ID: '123', StartDate: '2023-01-01', EndDate: '2023-02-01' } }],
        allLoading: false,
        allError: null,
        hasFetchedAllData: true,
      })

    render(<AnimalTrialOverview />)

    const tabs = screen.getByTestId('tabs')
    expect(within(tabs).getByText('Animal Specimen')).toBeInTheDocument()
    const animalSpecimenTab = within(tabs).getByText('Animal Specimen')
    const macrosampleTab = within(tabs).getByText('Macrosample')
    const microsampleTab = within(tabs).getByText('Microsample')

    // default tab is Animal Specimen Tab
    expect(animalSpecimenTab).toHaveClass('tab-active')
    expect(macrosampleTab).toHaveClass('!border-gray-200')
    expect(microsampleTab).toHaveClass('!border-gray-200')

    // switch to Macrosample tab
    fireEvent.click(macrosampleTab)
    expect(animalSpecimenTab).toHaveClass('!border-gray-200')
    expect(macrosampleTab).toHaveClass('tab-active')
    expect(microsampleTab).toHaveClass('!border-gray-200')

    // switch to Microsample tab
    fireEvent.click(microsampleTab)
    expect(animalSpecimenTab).toHaveClass('!border-gray-200')
    expect(macrosampleTab).toHaveClass('!border-gray-200')
    expect(microsampleTab).toHaveClass('tab-active')
  })
})