import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Tabs from './index'

describe('Tabs', () => {
  const mockTabs = ['Tab 1', 'Tab 2', 'Tab 3']

  it('renders all tabs', () => {
    render(
      <Tabs
        selectedTab='Tab 1'
        setSelectedTab={vi.fn()}
        tabs={mockTabs}
      />
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('marks the selected tab and keeps it in the keyboard tab order', () => {
    render(
      <Tabs
        selectedTab='Tab 2'
        setSelectedTab={vi.fn()}
        tabs={mockTabs}
      />
    )

    const selectedTab = screen.getByRole('tab', { name: 'Tab 2' })
    expect(selectedTab).toHaveAttribute('aria-selected', 'true')
    expect(selectedTab).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('tabindex', '-1')
  })

  it('calls setSelectedTab when tab clicked', async () => {
    const setSelectedTab = vi.fn()
    const user = userEvent.setup()

    render(
      <Tabs
        selectedTab='Tab 1'
        setSelectedTab={setSelectedTab}
        tabs={mockTabs}
      />
    )

    await user.click(screen.getByText('Tab 2'))

    expect(setSelectedTab).toHaveBeenCalledWith('Tab 2')
  })

  it('moves between tabs with arrow keys', async () => {
    const setSelectedTab = vi.fn()
    const user = userEvent.setup()
    render(<Tabs selectedTab='Tab 1' setSelectedTab={setSelectedTab} tabs={mockTabs} />)

    const firstTab = screen.getByRole('tab', { name: 'Tab 1' })
    firstTab.focus()
    await user.keyboard('{ArrowRight}')

    expect(setSelectedTab).toHaveBeenCalledWith('Tab 2')
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus()
  })

  it('renders with empty tabs array', () => {
    render(
      <Tabs
        selectedTab=''
        setSelectedTab={vi.fn()}
        tabs={[]}
      />
    )

    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument()
  })
})
