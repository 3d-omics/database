const Tabs = ({
  selectedTab,
  setSelectedTab,
  tabs,
}: {
  selectedTab: string
  setSelectedTab: (tabs: string) => void
  tabs: string[]
}) => {
  return (
      <div className="border-b-2 border-gray-200 relative mt-16" data-testid="tabs">
        <ul role="tablist" className="tabs tabs-bordered w-fit absolute -bottom-0.5 gap-2">
          {tabs.map((tab) => (
            <li role="tab"
              className={`tab h-10 hover:border-gray-300
              ${selectedTab === tab ? 'tab-active !border-burgundy !text-burgundy font-bold' : '!border-gray-200 hover:!border-gray-400'}
            `}
              onClick={() => setSelectedTab(tab)}
              key={tab}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
  )
}

export default Tabs