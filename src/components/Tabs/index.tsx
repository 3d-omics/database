const Tabs = ({ selectedTab, setSelectedTab, tabs }: {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  tabs: string[]
}) => {
  return (
    <div className='border-b-2 border-gray-200 mt-16 relative' data-testid='tabs'>
      <ul
        role='tablist'
        className='tabs tabs-lifted flex-nowrap gap-2 max-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap absolute -bottom-0.5'
      >
        {tabs.map((tab) => (
          <li
            role='tab'
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`tab h-10 shrink-0 hover:border-gray-300
              ${selectedTab === tab
                ? 'tab-active !text-burgundy font-bold '
                : 'hover:border-burgundy hover:border-b-2 hover:opacity-100 opacity-80'}
            `}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Tabs
