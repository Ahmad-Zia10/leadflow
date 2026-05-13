const FILTERS = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

function FilterBar({ activeFilter, onFilterChange }) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-slate-500">
                Filters:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
                {FILTERS.map((filter) => {
                    const isActive = activeFilter === filter;
                    return (
                        <button
                            key={filter}
                            onClick={() => onFilterChange?.(filter)}
                            className={
                                isActive
                                    ? "px-4 py-1.5 rounded-full text-sm font-medium bg-linear-to-r from-indigo-600 to-violet-600 text-white border border-transparent shadow-lg shadow-indigo-500/25 transition-all duration-200"
                                    : "px-4 py-1.5 rounded-full text-sm font-medium bg-transparent text-gray-600 dark:text-slate-400 border border-gray-300 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                            }
                        >
                            {filter}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default FilterBar;