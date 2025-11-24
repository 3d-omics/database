import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Tabs from '.'

describe('Tabs', () => {
  const mockSetSelectedTab = vi.fn()
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all tabs', () => {
    render(
      <Tabs 
        selectedTab="Tab 1" 
        setSelectedTab={mockSetSelectedTab} 
        tabs={tabs} 
      />
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('applies active styling to selected tab', () => {
    render(
      <Tabs 
        selectedTab="Tab 2" 
        setSelectedTab={mockSetSelectedTab} 
        tabs={tabs} 
      />
    )

    const activeTab = screen.getByText('Tab 2')
    expect(activeTab).toHaveClass('tab-active')
  })

  it('calls setSelectedTab when tab is clicked', () => {
    render(
      <Tabs 
        selectedTab="Tab 1" 
        setSelectedTab={mockSetSelectedTab} 
        tabs={tabs} 
      />
    )

    fireEvent.click(screen.getByText('Tab 2'))
    expect(mockSetSelectedTab).toHaveBeenCalledWith('Tab 2')
  })

  it('does not apply active styling to non-selected tabs', () => {
    render(
      <Tabs 
        selectedTab="Tab 1" 
        setSelectedTab={mockSetSelectedTab} 
        tabs={tabs} 
      />
    )

    const inactiveTab = screen.getByText('Tab 2')
    expect(inactiveTab).not.toHaveClass('tab-active')
  })
})