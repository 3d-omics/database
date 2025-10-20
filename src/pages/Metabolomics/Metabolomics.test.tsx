import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Metabolomics from 'pages/Metabolomics/index'
import AnalysisSettings from './components/AnalysisSetting'

// vi.mock('src/pages/Metabolomics/components/VolcanoPlot', () => ({
//   default: ({ calculatedData }: { calculatedData: any[] | null }) =>
//     calculatedData ? (
//       <div>Volcano Plot</div>
//     ) : (
//       <p>
//         Select target groups and click "Run Analysis" button to generate volcano plot.
//       </p>
//     ),
// }))

// Mock child components
vi.mock('./components/VolcanoPlot', () => ({
  __esModule: true,
  default: vi.fn(({ calculatedData }: { calculatedData: any[] | null }) =>
    calculatedData ? (
      <div>Volcano Plot</div>
    ) : (
      <p>
        Select target groups and click "Run Analysis" button to generate volcano plot.
      </p>
    )
  ),
}))

vi.mock('./components/AnalysisSetting', () => ({
  __esModule: true,
  default: vi.fn((props: any) => (
    <div>
      <label>
        Compare between:
        <select
          aria-label="Compare between:"
          value={props.compareBetween}
          onChange={e => props.setCompareBetween(e.target.value)}
        >
          <option value="Diet">Diet</option>
          <option value="Group">Group</option>
        </select>
      </label>
      <label>
        Group 1:
        <input
          aria-label="Group 1:"
          value={props.group1}
          onChange={e => props.setGroup1(e.target.value)}
        />
      </label>
      <label>
        Group 2:
        <input
          aria-label="Group 2:"
          value={props.group2}
          onChange={e => props.setGroup2(e.target.value)}
        />
      </label>
      <button onClick={() => props.setExecuteCreatePlot(true)}>Run Analysis</button>
    </div>
  )),
}))

vi.mock('./components/SignificantMetabolitesTable', () => ({
  __esModule: true,
  default: vi.fn(({ calculatedData }) =>
    calculatedData ? (
      <table data-testid="significant-metabolites-table">
        <tbody>
          <tr>
            <td>Metabolite 1</td>
          </tr>
        </tbody>
      </table>
    ) : null
  ),
}))



describe('Metabolomics page', () => {


  it('renders with default values', () => {
    render(<Metabolomics />)
    expect(screen.getByText('Metabolomics')).toBeInTheDocument()
    expect(screen.getByText('Compare between:')).toBeInTheDocument()
    expect(screen.getByText('Group 1:')).toBeInTheDocument()
    expect(screen.getByText('Group 2:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Analysis/i })).toBeInTheDocument()
    expect(screen.getByText('Select target groups and click "Run Analysis" button to generate volcano plot.')).toBeInTheDocument()
  })



  it('updates group values on compareBetween change', () => {
    render(<Metabolomics />)
    fireEvent.change(screen.getByLabelText('Compare between:'), { target: { value: 'Group' } })
    expect(screen.getByLabelText('Group 1:')).toHaveValue('LEBV')
    expect(screen.getByLabelText('Group 2:')).toHaveValue('HEBV')
    fireEvent.change(screen.getByLabelText('Compare between:'), { target: { value: 'Diet' } })
    expect(screen.getByLabelText('Group 1:')).toHaveValue('1')
    expect(screen.getByLabelText('Group 2:')).toHaveValue('3')
  })




  it('calls setExecuteCreatePlot when "Run Analysis" is clicked (thus VolcanoPlot and SignificantMetabolitesTable would be created)', () => {
    const mockSetExecuteCreatePlot = vi.fn()
    render(
      <AnalysisSettings
        compareBetween="Diet"
        setCompareBetween={vi.fn()}
        group1="1"
        setGroup1={vi.fn()}
        group2="3"
        setGroup2={vi.fn()}
        setExecuteCreatePlot={mockSetExecuteCreatePlot}
      />
    )
    const runButton = screen.getByRole('button', { name: /Run Analysis/i })
    fireEvent.click(runButton)
    expect(mockSetExecuteCreatePlot).toHaveBeenCalled()
  })
})
