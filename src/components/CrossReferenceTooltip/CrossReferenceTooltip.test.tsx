import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { vi } from 'vitest'


const props = {
  AIRTABLE_BASE_ID: "app123",
  AIRTABLE_TABLE_ID: "tbl123",
  RECORD_ID: "rec123",
  value: "A",
  fieldsName: [
    { key: 'ID', value: 'ID' },
    { key: 'Name', value: 'Name' },
    { key: 'Type', value: 'Type' },
    { key: 'Start date', value: 'StartDate' },
    { key: 'End date', value: 'EndDate' }
  ]
}

const mockSuccessData = {
  "id": "recpcVvH6spIFLv90",
  "createdTime": "2021-10-11T12:33:14.000Z",
  "fields": {
    "ID": "A",
    "Notes": "Kept in Freezer 5 -70C, in a ziplock bag",
    "Name": "Preliminary sampling trial",
    "StartDate": "2021-10-14",
    "EndDate": "2021-10-14",
    "LeadingInstitution": ["recuwCh6mxw5qZ4VD"],
    "WorkingDocument": "https://docs.google.com/document/d/1NpuE-_Q_q0RfMXcpxA1z-FRIg1Fcq6m9vYJsFsDu_xI/edit",
    "Treatment": ["recSTChaULIwYvLRC", "recOz8OKCiN37nsCa"],
    "Type": "In vivo",
    "ExperimentalUnit": ["recSZI37F2VuONgLu", "recDP4C1C5aVEhHze", "recrJY39qfrTRIJ5U", "recmlyLHgjCUpSzJy", "rec5PC8nnclTnZkO2", "reccJAb3onP75rJ9p", "recKE2lEPvJ96QWNh"],
    "Count_ExperimentalUnit": 7,
    "Count_Treatment": 2,
    "Serie_ExperimentalUnit": ["rec7DTYih7XIB0qCh", "recZ7tw9HzmKssVAb", "recVOYmnZlrQIOXZw", "rectyDCvGXZxTMTC5", "recX8jIkdlg5rqzhJ", "reckIaLNFqXPswx5R"],
    "Task": ["rectVuhk6TLrNTX4J"],
    "TaskName": ["Test chicken sampling"],
    "Status": "Finished",
    "WorkPackage_Task": ["recyOSdfqWpbVFmPe"],
    "Count_ExperimentalUnit copy": 7
  }
}

// ==========================================================================

describe('components > CrossReferenceTooltip', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should fetch and display Airtable data when hovered on icon', async () => {
    vi.doMock('axios', () => ({
      default: {
        get: vi.fn().mockResolvedValue({ data: mockSuccessData }),
      }
    }))
    const CrossReferenceTooltip = (await import('./index')).default;
    render(
      <CrossReferenceTooltip {...props} />
    )
    const icon = screen.getByTestId('cross-reference-icon')
    fireEvent.mouseEnter(icon)
    await waitFor(() => {
      expect(screen.getByText('Name:')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Preliminary sampling trial')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Type:')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('In vivo')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Start date:')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('End date:')).toBeInTheDocument()
    })
    await waitFor(() => {
      const dateElements = screen.getAllByText('2021-10-14')
      expect(dateElements.length).toBeGreaterThanOrEqual(2)
    })
  })




  it('should display error message when Airtable API request fails', async () => {
    const errorMessage = 'Network Error'
    vi.doMock('axios', () => ({
      default: {
        get: vi.fn().mockRejectedValue(new Error(errorMessage)),
      }
    }))
    const CrossReferenceTooltip = (await import('./index')).default;
    render(
      <CrossReferenceTooltip {...props} />
    )
    const icon = screen.getByTestId('cross-reference-icon')
    fireEvent.mouseEnter(icon)
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })



  it('should display loading indicator while fetching data', async () => {
    const CrossReferenceTooltip = (await import('./index')).default;
    render(
      <CrossReferenceTooltip {...props} />
    )
    const icon = screen.getByTestId('cross-reference-icon')
    fireEvent.mouseEnter(icon)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument())
  })




  it('should hide data and reset state on mouse leave', async () => {
    vi.doMock('axios', () => ({
      default: {
        get: vi.fn().mockResolvedValue({
          data: mockSuccessData
        }),
      }
    }))
    const CrossReferenceTooltip = (await import('./index')).default;
    render(
      <CrossReferenceTooltip {...props} />
    )
    const icon = screen.getByTestId('cross-reference-icon')
    fireEvent.mouseEnter(icon)
    await waitFor(() => {
      expect(screen.getByText('Name:')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Preliminary sampling trial')).toBeInTheDocument()
    })
    fireEvent.mouseLeave(icon)
    expect(screen.queryByText('Preliminary sampling trial')).not.toBeInTheDocument()
  })

})

