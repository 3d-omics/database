import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import DownloadTSVButton from './index';
import { ColumnDef } from '@tanstack/react-table';

describe('DownloadTSVButton', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    
    // Mock link click
    HTMLAnchorElement.prototype.click = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockColumns: ColumnDef<any>[] = [
    { id: 'id', header: 'ID' },
    { id: 'name', header: 'Name' },
  ];

  const mockData = [
    {
      original: { fields: { id: '1', name: 'Item 1' } },
      renderValue: vi.fn(),
    },
    {
      original: { fields: { id: '2', name: 'Item 2' } },
      renderValue: vi.fn(),
    },
  ];

  it('renders button with label', () => {
    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns}
        fileTitle="Test"
        buttonLabel="Download TSV"
      />
    );

    expect(screen.getByText('Download TSV')).toBeInTheDocument();
  });

  it('renders download icon', () => {
    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns}
        fileTitle="Test"
        buttonLabel="Download"
      />
    );

    expect(screen.getByTestId('download-tsv-icon')).toBeInTheDocument();
  });

  it('triggers download on button click', async () => {
    const user = userEvent.setup();

    render(
      <DownloadTSVButton
        filteredAndSortedData={mockData as any}
        columns={mockColumns}
        fileTitle="TestFile"
        buttonLabel="Download"
      />
    );

    const button = screen.getByText('Download');
    await user.click(button);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('handles data without fields property', async () => {
    const user = userEvent.setup();

    const dataWithoutFields = [
      { original: { id: '1', name: 'Item 1' }, renderValue: vi.fn() },
    ];

    render(
      <DownloadTSVButton
        filteredAndSortedData={dataWithoutFields as any}
        columns={mockColumns}
        fileTitle="Test"
        buttonLabel="Download"
      />
    );

    const button = screen.getByText('Download');
    await user.click(button);

    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});