import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    setActiveFilter,
    openAddLeadModal,
    closeAddLeadModal,
    openTimelineDialog,
    closeTimelineDialog,
    toggleTheme,
} from "../store/leadSlice"
import { useLeads, useCreateLead } from "../hooks/useLeads"
import { splitLeadsByFollowUp } from "../utils/helpers"
import Header from "../components/Header/Header"
import FilterBar from "../components/core/FilterBar"
import LeadList from "../components/Container/LeadList/LeadList"
import AddLeadModal from "../components/core/AddLeadModal"
import TimelineDialog from "../components/core/TimelineDialog"
import { Search } from "lucide-react"
import useDebounce from "../hooks/useDebounce"

function Home() {
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 400)

    const activeFilter = useSelector((state) => state.lead.activeFilter)
    const selectedLeadId = useSelector((state) => state.lead.selectedLeadId)
    const isAddLeadModalOpen = useSelector((state) => state.lead.isAddLeadModalOpen)
    const isTimelineDialogOpen = useSelector((state) => state.lead.isTimelineDialogOpen)
    const isDarkMode = useSelector((state) => state.lead.isDarkMode)

    const { leads, isPending, isError } = useLeads(debouncedSearch)

    console.log("isPending:", isPending)
    console.log("render")

    const { todayLeads, otherLeads } = splitLeadsByFollowUp(leads)

    const handleFilterChange = (filter) => {
        dispatch(setActiveFilter(filter))
        setSearchQuery("")
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-400 dark:text-slate-500">
                        Loading leads...
                    </p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <p className="text-sm text-red-500">
                        Failed to load leads. Is the backend running?
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            <Header
                onAddLeadClick={() => dispatch(openAddLeadModal())}
                isDarkMode={isDarkMode}
                onToggleTheme={() => dispatch(toggleTheme())}
            />
            <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
                <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                />

                    {/* Search Bar */}
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search leads by name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                            bg-white dark:bg-white/5
                            border border-gray-200 dark:border-white/10
                            text-gray-900 dark:text-white
                            placeholder-gray-400 dark:placeholder-slate-500
                            focus:outline-none focus:ring-2
                            focus:ring-indigo-500/30 dark:focus:ring-indigo-500/20
                            focus:border-indigo-400 dark:focus:border-indigo-500/50
                            transition-all duration-200"
                    />
                </div>

                <LeadList
                    leads={otherLeads}
                    todayLeads={todayLeads}
                    onLeadClick={(lead) => dispatch(openTimelineDialog(lead._id))}
                />
            </div>
            <AddLeadModal
                isOpen={isAddLeadModalOpen}
                onClose={() => dispatch(closeAddLeadModal())}
            />
            <TimelineDialog
                isOpen={isTimelineDialogOpen}
                onClose={() => dispatch(closeTimelineDialog())}
                leadId={selectedLeadId}
            />
        </div>
    )
}

export default Home