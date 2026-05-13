import Header from "../components/Header/Header"
import FilterBar from "../components/core/FilterBar"

function Home({ isDarkMode, onToggleTheme }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            <Header
                onAddLeadClick={() => {}}
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
            />
            <div className="max-w-5xl mx-auto px-6 py-6">
                <FilterBar
                    activeFilter="All"
                    onFilterChange={() => {}}
                />
            </div>
        </div>
    )
}

export default Home