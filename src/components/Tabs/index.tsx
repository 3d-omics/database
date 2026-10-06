import type { KeyboardEvent } from 'react'

const Tabs = ({ selectedTab, setSelectedTab, tabs }: {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  tabs: string[]
}) => {
  if (tabs.length === 0) return null

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1
    else return

    event.preventDefault()
    setSelectedTab(tabs[nextIndex])
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]
      ?.focus()
  }

  return (
    <div className='max-w-full overflow-x-auto pb-1' data-testid='tabs'>
      <div
        role='tablist'
        aria-label='Related data'
        className='inline-flex min-w-max gap-1 rounded-xl border border-line bg-surface_muted p-1 shadow-sm'
      >
        {tabs.map((tab, index) => (
          <button
            role='tab'
            type='button'
            key={tab}
            aria-selected={selectedTab === tab}
            aria-controls='related-data-panel'
            tabIndex={selectedTab === tab ? 0 : -1}
            onClick={() => setSelectedTab(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`shrink-0 rounded-lg px-4 py-2.5 font-jakarta text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy_ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface
              ${selectedTab === tab
                ? 'bg-burgundy text-neutral-50 shadow-sm'
                : 'text-ink_muted hover:bg-surface hover:text-burgundy_ink'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
export default Tabs
