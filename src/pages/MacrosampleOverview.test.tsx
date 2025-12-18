import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MacrosampleOverview from './MacrosampleOverview'
import useValidateParams from 'hooks/useValidateParams'

// Mock hooks
vi.mock('hooks/useValidateParams')

// Mock data
vi.mock('assets/data/airtable/intestinalsectionsample.json', () => ({
  default: [
    {
      id: '1',
      createdTime: '2024-01-01',
      fields: {
        ID: 'M001',
        Individual: 'AS001',
        Code: 'CODE123',
        'Sample type': 'Tissue',
        'Data type': 'Metagenomics',
        Description: 'Ileum sample',
        Container: 'Tube',
        Preservative: 'Ethanol',
        Weight: 0.5,
        'ENA accession': 'ERS12345',
        'ENA link': 'https://example.com/ena',
      },
    },
  ],
}))

// Mock components
vi.mock('components/BreadCrumbs', () => ({
  default: ({ items }: any) => (
    <div data-testid='breadcrumbs'>
      {items.map((item: any) => <span key={item.label}>{item.label}</span>)}
    </div>
  ),
}))

vi.mock('components/ParamsValidator', () => ({
  default: ({ children, notFound }: any) => notFound ? <div>Not Found</div> : <div>{children}</div>,
}))

vi.mock('components/Tabs', () => ({
  default: ({ tabs, selectedTab, setSelectedTab }: any) => (
    <div data-testid='tabs'>
      {tabs.map((tab: string) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          data-selected={selectedTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('components/TabComponents/CryosectionTab', () => ({
  default: ({ id }: any) => <div data-testid='cryosection-tab'>Cryosection Tab: {id}</div>,
}))

vi.mock('components/TabComponents/MicrosampleTab', () => ({
  default: ({ id }: any) => <div data-testid='microsample-tab'>Microsample Tab: {id}</div>,
}))

describe('MacrosampleOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: false,
    })
  })

  const renderPage = (macrosampleName = 'M001') => {
    return render(
      <MemoryRouter
        initialEntries={[`/macrosamples/${macrosampleName}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path='/macrosamples/:macrosampleName' element={<MacrosampleOverview />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders breadcrumbs', () => {
    renderPage()

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    expect(screen.getByText('Data Portal Home')).toBeInTheDocument()
    expect(screen.getByText('Macrosamples')).toBeInTheDocument()
  })

  it('displays macrosample name', () => {
    renderPage()

    const headers = screen.getAllByText('M001')
    expect(headers.length).toBeGreaterThan(0)
  })

  it('displays macrosample details', () => {
    renderPage()

    expect(screen.getByText('AS001')).toBeInTheDocument()
    expect(screen.getByText('CODE123')).toBeInTheDocument()
    expect(screen.getByText('Tissue')).toBeInTheDocument()
    expect(screen.getByText('Metagenomics')).toBeInTheDocument()
    expect(screen.getByText('Ileum sample')).toBeInTheDocument()
    expect(screen.getByText('Tube')).toBeInTheDocument()
    expect(screen.getByText('Ethanol')).toBeInTheDocument()
    expect(screen.getByText('0.5')).toBeInTheDocument()
  })

  it('displays ENA accession link', () => {
    renderPage()

    const link = screen.getByRole('link', { name: 'ERS12345' })
    expect(link).toHaveAttribute('href', 'https://example.com/ena')
  })

  it('renders tabs', () => {
    renderPage()

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByText('Cryosections')).toBeInTheDocument()
    expect(screen.getByText('Microsamples')).toBeInTheDocument()
  })

  it('shows Cryosections tab by default', () => {
    renderPage()

    expect(screen.getByTestId('cryosection-tab')).toBeInTheDocument()
    expect(screen.getByTestId('cryosection-tab')).toHaveTextContent('M001')
  })

  it('switches to Microsamples tab when clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    const microsamplesButton = screen.getByText('Microsamples')
    await user.click(microsamplesButton)

    expect(screen.getByTestId('microsample-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('cryosection-tab')).not.toBeInTheDocument()
  })

  it('shows not found when validation fails', () => {
    (useValidateParams as any).mockReturnValue({
      validating: false,
      notFound: true,
    })

    renderPage()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })
})