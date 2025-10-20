import { render, screen, fireEvent } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import AnimalSpecimen from 'pages/AnimalSpecimen'
import useGetFirst100Data from 'hooks/useGetFirst100Data'

// mock the hook with Vitest
vi.mock('hooks/useGetFirst100Data', () => ({
  default: vi.fn(),
}))

describe('AnimalSpecimen page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders complete table view', () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: null,
      allData: [
        {
          fields: {
            ID: 'A001',
            Experiment_flat: 'Exp1',
            Treatment_flat: 'Treat1',
            TreatmentName: ['Treat Name 1'],
            Pen: 'Pen1',
            SlaughteringDayCount: 2,
            SlaughteringDate: '2023-10-10',
            Weight: 500,
          },
        },
      ],
      allLoading: false,
      allError: null,
    })

    render(<AnimalSpecimen />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Experiment')).toBeInTheDocument()
    expect(screen.getByText('Treatment')).toBeInTheDocument()
    expect(screen.getByText('A001')).toBeInTheDocument()
  })






  it('apply filter', () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: null,
      allData: [
        {
          fields: {
            ID: 'A001',
            Experiment_flat: 'Exp1',
            Treatment_flat: 'Treat1',
            TreatmentName: ['Treat Name 1'],
            Pen: 'Pen1',
          },
        },
      ],
      allLoading: false,
      allError: null,
    })

    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'Exp1' }]} />)

    expect(screen.getByText('A001')).toBeInTheDocument()
  })






  it('displays cross reference tooltip', async () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: null,
      allData: [
        {
          fields: {
            Experiment_flat: 'Exp1',
            Experiment: 'expId'
          }
        }
      ],
      allLoading: false,
      allError: null,
    })

    render(<AnimalSpecimen />)
    expect(screen.getByTestId('cross-reference-icon')).toBeInTheDocument()
  })





  it('display error UI when fetching first 100 data fails', () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: 'Error fetching first 100 records',
      allData: [],
      allLoading: false,
      allError: null,
    })

    render(<AnimalSpecimen />)

    expect(screen.getByText('Error! Something went wrong. Please try again.')).toBeInTheDocument()
    expect(screen.getByText('Error fetching first 100 records')).toBeInTheDocument()
  })




  it('display error UI when fetching all data fails', () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: null,
      allData: [],
      allLoading: false,
      allError: 'Error fetching all records',
    })

    render(<AnimalSpecimen />)

    expect(screen.getByText('Error! Something went wrong. Please try again.')).toBeInTheDocument()
    expect(screen.getByText('Error fetching all records')).toBeInTheDocument()
  })




  it('display correct message when no data is found', () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: null,
      allData: [],
      allLoading: false,
      allError: null,
    })

    render(<AnimalSpecimen />)

    expect(screen.getByText('No data was found.')).toBeInTheDocument()
  })




  it('display correct data with filteredWith props', () => {
    ; (useGetFirst100Data as Mock).mockReturnValue({
      first100Data: [],
      first100Loading: false,
      first100Error: null,
      allData: [
        {
          fields: {
            ID: 'A001',
            Experiment_flat: 'Exp1'
          }
        },
      ],
      allLoading: false,
      allError: null,
    })

    render(<AnimalSpecimen filterWith={[{ id: 'Experiment_flat', value: 'beta experiment' }]} />)

    expect(screen.getByText('A001')).toBeInTheDocument()
  })
})
