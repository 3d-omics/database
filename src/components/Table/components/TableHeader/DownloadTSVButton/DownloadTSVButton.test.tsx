import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import DownloadTSVButton from '.'

import type { Row } from '@tanstack/react-table'

const makeRow = (row: any): Row<any> =>
  ({
    ...row,
    getValue: (colId: string) => row.original.fields[colId],
    // Add any other minimal Row API methods your component uses here
  } as Row<any>)

const props = {
  columns: [
    { id: 'ID', header: 'ID' },
    { id: 'Name', header: 'Name' },
    {
      id: 'Type',
      header: 'Type',
      enableSorting: false,
      meta: { filterVariant: 'select', uniqueValues: ['In vivo'] },
    },
    { id: 'StartDate', header: 'Start Date', enableColumnFilter: false },
    { id: 'EndDate', header: 'End Date', enableColumnFilter: false },
  ],
  filteredAndSortedData: [
    {
      id: '2',
      index: 2,
      original: {
        id: 'recrXmjSpb7u9rWhG',
        createdTime: '2021-10-11T12:33:14.000Z',
        fields: {
          ID: 'C',
          Name: 'C - Proof-of-principle swine trial',
          StartDate: '2022-02-23',
          EndDate: '2022-05-02',
          Type: 'In vivo',
        },
      },
    },
    {
      id: '7',
      index: 7,
      original: {
        id: 'rechUt4qYvCw707vb',
        createdTime: '2022-12-05T13:51:13.000Z',
        fields: {
          ID: 'I',
          Name: 'I - Protein efficiency experiment (swine) trial A',
          StartDate: '2023-05-09',
          EndDate: '2023-08-08',
          Type: 'In vivo',
        },
      },
    },
    {
      id: '8',
      index: 8,
      original: {
        id: 'recuoYKZJA49ldZrI',
        createdTime: '2022-12-05T13:51:14.000Z',
        fields: {
          ID: 'J',
          Name: 'J - Mannan fibre experimen (swine)',
          StartDate: '2023-01-10',
          EndDate: '2023-03-16',
          Type: 'In vivo',
        },
      },
    },
    {
      id: '9',
      index: 9,
      original: {
        id: 'rec2gEj1qrghG2orD',
        createdTime: '2023-04-21T12:03:12.000Z',
        fields: {
          ID: 'K',
          Name: 'K - Protein efficiency experiment (swine) trial B',
          StartDate: '2023-08-24',
          EndDate: '2023-10-26',
          Type: 'In vivo',
        },
      },
    },
  ].map(makeRow),
  fileTitle: 'Animal Trial Experiment',
  buttonLabel: 'Download TSV',
}

function mockDownloadLink() {
  const clickMock = vi.fn()
  const appendChildMock = vi.fn()
  const removeChildMock = vi.fn()

  const mockLink = {
    href: '',
    download: '',
    click: clickMock,
    setAttribute: vi.fn(),
    remove: vi.fn(),
    style: {},
  }

  const originalCreateElement = document.createElement
  vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
    if (tagName === 'a') return mockLink as unknown as HTMLAnchorElement
    return originalCreateElement.call(document, tagName)
  })

  vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildMock)
  vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildMock)

  return { mockLink, clickMock, appendChildMock, removeChildMock }
}




describe('components > DownloadTSVButton', () => {
  let root: HTMLDivElement

  beforeEach(() => {
    root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })





  it('should render with correct text and icon', () => {
    render(<DownloadTSVButton {...props} />)
    expect(screen.getByTestId('download-tsv-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Download TSV/i })).toBeInTheDocument()
  })






  it('should trigger file download when clicked, creates TSV with correct filename', () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:url')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL

    const { mockLink, clickMock, appendChildMock, removeChildMock } = mockDownloadLink()

    render(<DownloadTSVButton {...props} />, { container: root })
    fireEvent.click(screen.getByText('Download TSV'))

    expect(createObjectURL).toHaveBeenCalled()
    expect(mockLink.download).toBe('Animal Trial Experiment.tsv')
    expect(clickMock).toHaveBeenCalled()
    expect(appendChildMock).toHaveBeenCalled()
    expect(removeChildMock).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalled()
  })




  it('should create TSV with correct headers and data', async () => {
    const expectedTSV = [
      'ID\tName\tType\tStart Date\tEnd Date',
      'C\tC - Proof-of-principle swine trial\tIn vivo\t2022-02-23\t2022-05-02',
      'I\tI - Protein efficiency experiment (swine) trial A\tIn vivo\t2023-05-09\t2023-08-08',
      'J\tJ - Mannan fibre experimen (swine)\tIn vivo\t2023-01-10\t2023-03-16',
      'K\tK - Protein efficiency experiment (swine) trial B\tIn vivo\t2023-08-24\t2023-10-26',
    ].join('\n')

    let capturedBlob: any = null
    const createObjectURL = vi.fn((blob: any) => {
      capturedBlob = blob
      return 'blob:url'
    })
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = vi.fn()

    mockDownloadLink()

    const originalBlob = global.Blob
    global.Blob = vi.fn().mockImplementation((content, options) => {
      return {
        text: () => Promise.resolve(content[0]),
        type: options.type,
      }
    })

    render(<DownloadTSVButton {...props} />, { container: root })
    fireEvent.click(screen.getByText('Download TSV'))

    expect(capturedBlob).not.toBeNull()
    const text = await capturedBlob.text()
    expect(text.trim()).toBe(expectedTSV)

    global.Blob = originalBlob
  })




  
  it('should handle empty data gracefully', async () => {
    const emptyDataProps = {
      filteredAndSortedData: [],
      columns: [],
      fileTitle: 'empty',
      buttonLabel: 'Download TSV',
    }

    let capturedBlob: any = null
    const createObjectURL = vi.fn((blob: any) => {
      capturedBlob = blob
      return 'blob:url'
    })
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = vi.fn()

    mockDownloadLink()

    const originalBlob = global.Blob
    global.Blob = vi.fn().mockImplementation((content, options) => {
      return {
        text: () => Promise.resolve(content[0]),
        type: options.type,
      }
    })

    render(<DownloadTSVButton {...emptyDataProps} />, { container: root })
    fireEvent.click(screen.getByText('Download TSV'))

    expect(createObjectURL).toHaveBeenCalled()
    expect(capturedBlob).not.toBeNull()

    const text = await capturedBlob.text()
    expect(text.trim()).toBe('')

    global.Blob = originalBlob
  })
})
