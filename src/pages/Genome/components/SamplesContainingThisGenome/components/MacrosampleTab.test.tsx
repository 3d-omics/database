import { render, screen } from '@testing-library/react'
import MacrosampleTab from './MacrosampleTab'

describe('Genome page > SamplesContainingThisGenome > MacrosampleTab', () => {
  const mockData = [
    { id: 'M301570', count: '0.177' },
    { id: 'M301571', count: '0.259' },
  ]

  it('renders loading state', () => {
    render(
      <MacrosampleTab
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
      <MacrosampleTab
        data={[]}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error="Failed to load data"
      />
    )

    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
  })

  it('renders "no macrosamples" message when data is empty', () => {
    render(
      <MacrosampleTab
        data={[]}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText(/No macrosamples containing/i)).toBeInTheDocument()
    expect(screen.getByText(/TG2:bin_000003/i)).toBeInTheDocument()
    expect(screen.getByText(/were found/i)).toBeInTheDocument()
  })

  it('renders table with correct count label for single macrosample', () => {
    render(
      <MacrosampleTab
        data={[mockData[0]]}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/macrosample containing/i)).toBeInTheDocument()
    expect(screen.getByText('TG2:bin_000003')).toBeInTheDocument()
    expect(screen.getByText('M301570')).toBeInTheDocument()
    expect(screen.getByText('0.177')).toBeInTheDocument()
  })

  it('renders table with correct count label for multiple macrosamples', () => {
    render(
      <MacrosampleTab
        data={mockData}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/macrosamples containing/i)).toBeInTheDocument()
    expect(screen.getByText('TG2:bin_000003')).toBeInTheDocument()
    expect(screen.getByText('M301570')).toBeInTheDocument()
    expect(screen.getByText('0.177')).toBeInTheDocument()
    expect(screen.getByText('M301571')).toBeInTheDocument()
    expect(screen.getByText('0.259')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    render(
      <MacrosampleTab
        data={mockData}
        genomeName="TG2:bin_000003"
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('Macrosample ID')).toBeInTheDocument()
    expect(screen.getByText('Count')).toBeInTheDocument()
  })
})