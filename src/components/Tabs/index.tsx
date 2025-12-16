const Tabs = ({
  selectedTab,
  setSelectedTab,
  tabs,
}: {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  tabs: string[]
}) => {
  return (
    <div className="border-b-2 border-gray-200 mt-16 relative" data-testid="tabs">
      <ul
        role="tablist"
        className="
          tabs tabs-bordered
          flex-nowrap
          gap-2
          max-w-full
          overflow-x-auto overflow-y-hidden
          whitespace-nowrap
          absolute -bottom-0.5
        "
      >
        {tabs.map((tab) => (
          <li
            role="tab"
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`
              tab h-10 shrink-0
              hover:border-gray-300
              ${selectedTab === tab
                ? 'tab-active !border-burgundy !text-burgundy font-bold'
                : '!border-gray-200 hover:!border-gray-400'}
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
