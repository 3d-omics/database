import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Tabs from './index';

describe('Tabs', () => {
  const mockTabs = ['Tab 1', 'Tab 2', 'Tab 3'];

  it('renders all tabs', () => {
    render(
      <Tabs
        selectedTab="Tab 1"
        setSelectedTab={vi.fn()}
        tabs={mockTabs}
      />
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('applies active styling to selected tab', () => {
    render(
      <Tabs
        selectedTab="Tab 2"
        setSelectedTab={vi.fn()}
        tabs={mockTabs}
      />
    );

    const selectedTab = screen.getByText('Tab 2');
    expect(selectedTab).toHaveClass('tab-active');
  });

  it('calls setSelectedTab when tab clicked', async () => {
    const setSelectedTab = vi.fn();
    const user = userEvent.setup();

    render(
      <Tabs
        selectedTab="Tab 1"
        setSelectedTab={setSelectedTab}
        tabs={mockTabs}
      />
    );

    await user.click(screen.getByText('Tab 2'));

    expect(setSelectedTab).toHaveBeenCalledWith('Tab 2');
  });

  it('renders with empty tabs array', () => {
    render(
      <Tabs
        selectedTab=""
        setSelectedTab={vi.fn()}
        tabs={[]}
      />
    );

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });
});