import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import SignificantMetabolitesTable from './index';

describe('SignificantMetabolitesTable', () => {
  const mockData = [
    { metabolite: 'M001', fold_change: 2.5, p_value: 3.2, significant: true },
    { metabolite: 'M002', fold_change: -1.8, p_value: 2.8, significant: true },
    { metabolite: 'M003', fold_change: 1.2, p_value: 1.5, significant: false },
    { metabolite: 'M004', fold_change: 3.0, p_value: 4.0, significant: true },
    { metabolite: 'M005', fold_change: 0.8, p_value: 1.0, significant: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render table when calculatedData is null', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={null}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.queryByTestId('significant-metabolites-table')).not.toBeInTheDocument();
  });

  it('renders table with data', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.getByTestId('significant-metabolites-table')).toBeInTheDocument();
    expect(screen.getByText('M001')).toBeInTheDocument();
    expect(screen.getByText('M002')).toBeInTheDocument();
  });

  it('displays correct table headers', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.getByText('Metabolite')).toBeInTheDocument();
    expect(screen.getByText('Fold Change')).toBeInTheDocument();
    expect(screen.getByText('P-Value')).toBeInTheDocument();
    expect(screen.getByText('Significant')).toBeInTheDocument();
  });

  it('filters data by p-value threshold', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05} // -log10(0.05) ≈ 1.3
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    // Only items with p_value > 1.3 should be visible
    // M001 (3.2), M002 (2.8), M003 (1.5), M004 (4.0) are > 1.3
    expect(screen.getByText('M001')).toBeInTheDocument();
    expect(screen.getByText('M004')).toBeInTheDocument();
    
    // M005 (1.0) should not be visible
    expect(screen.queryByText('M005')).not.toBeInTheDocument();
  });

  it('sorts data by absolute fold change in descending order', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    const rows = screen.getAllByRole('row');
    // Skip header row (index 0)
    // M004 has highest absolute fold change (3.0)
    expect(rows[1]).toHaveTextContent('M004');
    // M001 has second highest (2.5)
    expect(rows[2]).toHaveTextContent('M001');
  });

  it('displays "Yes" badge for significant metabolites', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    const yesBadges = screen.getAllByText('Yes');
    expect(yesBadges.length).toBeGreaterThan(0);
  });

  it('displays "No" badge for non-significant metabolites', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    const noBadges = screen.getAllByText('No');
    expect(noBadges.length).toBeGreaterThan(0);
  });

  it('displays only 30 rows initially', () => {
    const largeDataset = Array.from({ length: 50 }, (_, i) => ({
      metabolite: `M${i.toString().padStart(3, '0')}`,
      fold_change: 2.0 + Math.random(),
      p_value: 3.0 + Math.random(),
      significant: true,
    }));

    render(
      <SignificantMetabolitesTable
        calculatedData={largeDataset}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    const rows = screen.getAllByRole('row');
    // 30 data rows + 1 header row = 31 total
    expect(rows).toHaveLength(31);
  });

  it('shows "Load more" button when more than 30 rows', () => {
    const largeDataset = Array.from({ length: 40 }, (_, i) => ({
      metabolite: `M${i.toString().padStart(3, '0')}`,
      fold_change: 2.0 + Math.random(),
      p_value: 3.0 + Math.random(),
      significant: true,
    }));

    render(
      <SignificantMetabolitesTable
        calculatedData={largeDataset}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.getByRole('button', { name: /Load more/i })).toBeInTheDocument();
  });

  it('does not show "Load more" button when 30 or fewer rows', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.queryByRole('button', { name: /Load more/i })).not.toBeInTheDocument();
  });

  it('loads 10 more rows when "Load more" clicked', async () => {
    const user = userEvent.setup();
    const largeDataset = Array.from({ length: 50 }, (_, i) => ({
      metabolite: `M${i.toString().padStart(3, '0')}`,
      fold_change: 2.0 + Math.random(),
      p_value: 3.0 + Math.random(),
      significant: true,
    }));

    render(
      <SignificantMetabolitesTable
        calculatedData={largeDataset}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    const loadMoreButton = screen.getByRole('button', { name: /Load more/i });
    await user.click(loadMoreButton);

    const rows = screen.getAllByRole('row');
    // 40 data rows + 1 header row = 41 total
    expect(rows).toHaveLength(41);
  });

  it('resets displayed rows when executeCreatePlot changes', () => {
    const largeDataset = Array.from({ length: 50 }, (_, i) => ({
      metabolite: `M${i.toString().padStart(3, '0')}`,
      fold_change: 2.0 + Math.random(),
      p_value: 3.0 + Math.random(),
      significant: true,
    }));

    const { rerender } = render(
      <SignificantMetabolitesTable
        calculatedData={largeDataset}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    // Should show 30 rows initially
    expect(screen.getAllByRole('row')).toHaveLength(31);

    // Simulate executeCreatePlot change
    rerender(
      <SignificantMetabolitesTable
        calculatedData={largeDataset}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={true}
      />
    );

    // Should reset to 30 rows
    expect(screen.getAllByRole('row')).toHaveLength(31);
  });

  it('formats fold change to 2 decimal places', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.getByText('2.50')).toBeInTheDocument(); // M001: 2.5 -> 2.50
    expect(screen.getByText('-1.80')).toBeInTheDocument(); // M002: -1.8 -> -1.80
  });

  it('formats p-value to 2 decimal places', () => {
    render(
      <SignificantMetabolitesTable
        calculatedData={mockData}
        pValueThreshold={0.05}
        foldChangeThreshold={1.5}
        executeCreatePlot={false}
      />
    );

    expect(screen.getByText('3.20')).toBeInTheDocument(); // M001: 3.2 -> 3.20
    expect(screen.getByText('2.80')).toBeInTheDocument(); // M002: 2.8 -> 2.80
  });
});