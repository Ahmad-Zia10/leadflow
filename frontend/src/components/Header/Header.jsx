import { TrendingUp, Plus, Sun, Moon } from "lucide-react";

function Header({ onAddLeadClick, isDarkMode, onToggleTheme }) {
    return (
        <header className="w-full sticky top-0 z-50 bg-white dark:bg-[#0d0d14] border-b border-gray-200 dark:border-white/8 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        LeadFlow
                    </span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">

                    {/* Theme toggle */}
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
                    >
                        {isDarkMode
                            ? <Sun className="w-4 h-4" />
                            : <Moon className="w-4 h-4" />
                        }
                    </button>

                    {/* Add New Lead button */}
                    <button
                        onClick={onAddLeadClick}
                        className="inline-flex items-center gap-1.5 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        Add New Lead
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;