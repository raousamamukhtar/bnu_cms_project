export const DataEntryTabs = ({ tabs, currentTab, submittedTabs, onTabClick }) => {
  return (
    <>
      {tabs.map((tab) => {
        const isSubmitted = submittedTabs[tab.stepId] || false;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabClick(tab.id)}
            className={`relative px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              isActive
                ? 'text-emerald-600 border-emerald-600'
                : 'text-slate-600 border-transparent hover:text-emerald-600 hover:border-emerald-300'
            }`}
          >
            {tab.title}
            {isSubmitted && <span className="ml-2 text-emerald-600">✓</span>}
          </button>
        );
      })}
    </>
  );
};

