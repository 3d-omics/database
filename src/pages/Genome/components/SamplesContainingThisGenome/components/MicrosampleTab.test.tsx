import { render, screen } from '@testing-library/react'
import MicrosampleTab from './MicrosampleTab'

describe('Genome page > SamplesContainingThisGenome > MicrosampleTab', () => {
  const mockData = [
    { id: 'MICRO001', count: '1.5' },
    { id: 'MICRO002', count: '2.1' },
  ]

  it('renders loading state', () => {
    render(
      <MicrosampleTab
        data={[]}
        genomeName="TG2:bin_000003"
        isLoading={true}
        error={null}
      />
    )

    expect(screen.getByText((content, element) => {
      return element?.classList.contains('loading') || false
    })).toBeInTheDocument()
  })

  it('renders error banner when error exists', () => {
    render(
      <MicrosampleTab
        data={[]}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error="Failed to load data"
      />
    )

    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
  })

  it('renders "no microsamples" message when data is null', () => {
    render(
      <MicrosampleTab
        data={null}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText(/No microsamples containing/i)).toBeInTheDocument()
    expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
    expect(screen.getByText(/were found/i)).toBeInTheDocument()
  })

  it('renders "no microsamples" message when data is empty', () => {
    render(
      <MicrosampleTab
        data={[]}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText(/No microsamples containing/i)).toBeInTheDocument()
    expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
    expect(screen.getByText(/were found/i)).toBeInTheDocument()
  })

  it('renders table with correct count label for single microsample', () => {
    render(
      <MicrosampleTab
        data={[mockData[0]]}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/microsample containing/i)).toBeInTheDocument()
    expect(screen.getByText('TG2:bin_000003')).toBeInTheDocument()
    expect(screen.getByText('MICRO001')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument()
  })

  it('renders table with correct count label for multiple microsamples', () => {
    render(
      <MicrosampleTab
        data={mockData}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/microsamples containing/i)).toBeInTheDocument()
    expect(screen.getByText('TG2:bin_000003')).toBeInTheDocument()
    expect(screen.getByText('MICRO001')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument()
    expect(screen.getByText('MICRO002')).toBeInTheDocument()
    expect(screen.getByText('2.1')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    render(
      <MicrosampleTab
        data={mockData}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('Microsample ID')).toBeInTheDocument()
    expect(screen.getByText('Count')).toBeInTheDocument()
  })
})