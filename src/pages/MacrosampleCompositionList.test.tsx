import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MacrosampleCompositionList from './MacrosampleCompositionList'

// Mock data
vi.mock('assets/data/airtable/animaltrialexperiment.json', () => ({
  default: [
    {
      id: '1',
      fields: {
        Name: 'Experiment G',
        ID: 'G',
        'MAG catalogue - Number of MAGs': 500,
        'MAG catalogue - Average completeness (%)': 95.5,
      },
    },
    {
      id: '2',
      fields: {
        Name: 'Experiment H',
        ID: 'H',
      },
    },
    {
      id: '3',
      fields: {
        Name: 'M - Histomonas experiment (turkey)',
        ID: 'M',
      },
    },
  ],
}))

// Trial G has three MAGs in two phyla, detected across two samples: one with two
// equally abundant MAGs (a Shannon diversity of 2), the other with abundances ¼, ¼
// and ½ (2^1.5). Trial H has no composition data
const genomeFiles: Record<string, Record<string, (string | number)[]>> = {
  experiment_G_counts: { genome: ['g1', 'g2', 'g3'], S1: [1, 1, 0], S2: [1, 1, 2] },
  experiment_G_metadata: { genome: ['g1', 'g2', 'g3'], phylum: ['p__Bacillota', 'p__Bacillota', 'p__Bacteroidota'] },
  experiment_M_counts: { genome: ['g1'], S1: [5] },
  experiment_M_metadata: { genome: ['g1'], phylum: ['p__Bacillota'] },
}

vi.mock('hooks/useJsonData', () => ({
  useGenomeJsonFile: (_folder: string, fileName: string) => genomeFiles[fileName] ?? null,
}))

describe('MacrosampleCompositionList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () => {
    return render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MacrosampleCompositionList />
      </BrowserRouter>
    )
  }

  // The block of the trial headed by `name`
  const getBlock = (name: string | RegExp) =>
    screen.getAllByRole('listitem').find((item) => within(item).queryByRole('heading', { level: 2, name }))!

  // The figure a block shows under `label`
  const getFigure = (block: HTMLElement, label: string) => {
    const labels = within(block).getAllByRole('term').map((term) => term.textContent)
    return within(block).getAllByRole('definition')[labels.indexOf(label)]
  }

  it('renders page header', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Metagenomics' })).toBeInTheDocument()
  })

  it('renders page description', () => {
    renderPage()
    expect(screen.getByText(/DNA sequencing reads produced/i)).toBeInTheDocument()
  })

  it('renders all experiments', () => {
    renderPage()

    expect(screen.getByText('Experiment G')).toBeInTheDocument()
    expect(screen.getByText('Experiment H')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Trial M — Histomonas experiment (turkey)' })).toBeInTheDocument()
  })

  it('links each heading to its composition page', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Experiment G' })).toHaveAttribute('href', '/macrosample-compositions/Experiment%20G')
    const heading = screen.getByRole('heading', { level: 2, name: /Trial M/ })
    expect(within(heading).getByRole('link')).toHaveAttribute('href', '/macrosample-compositions/M%20-%20Histomonas%20experiment%20(turkey)')
  })

  it('tags a trial with the host named in its name', () => {
    renderPage()

    expect(within(getBlock(/Trial M/)).getByText('turkey')).toBeInTheDocument()
  })

  it('offers a button to browse each composition', () => {
    renderPage()

    const buttons = screen.getAllByRole('link', { name: /Browse composition/ })
    expect(buttons.map((button) => button.getAttribute('href'))).toEqual([
      '/macrosample-compositions/Experiment%20G',
      '/macrosample-compositions/Experiment%20H',
      '/macrosample-compositions/M%20-%20Histomonas%20experiment%20(turkey)',
    ])
  })

  it('shows the composition figures computed from the trial\'s counts', () => {
    renderPage()

    const experimentG = getBlock('Experiment G')
    expect(getFigure(experimentG, 'Number of MAGs')).toHaveTextContent('3')
    expect(getFigure(experimentG, 'Number of phyla')).toHaveTextContent('2')
    expect(getFigure(experimentG, 'Number of samples')).toHaveTextContent('2')
    expect(getFigure(experimentG, 'Average Shannon diversity')).toHaveTextContent('2.4')
  })

  it('does not show the MAG catalogue\'s figures', () => {
    renderPage()

    expect(screen.queryByText('Average completeness')).not.toBeInTheDocument()
    expect(screen.queryByText('500')).not.toBeInTheDocument()
    expect(screen.queryByText('95.50%')).not.toBeInTheDocument()
  })

  it('shows dashes for a trial without composition data', () => {
    renderPage()

    const experimentH = getBlock('Experiment H')
    expect(within(experimentH).getAllByText('—')).toHaveLength(4)
  })
})
