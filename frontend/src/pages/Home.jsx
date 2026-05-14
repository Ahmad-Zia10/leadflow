import { useDispatch, useSelector } from "react-redux"
import {
    setActiveFilter,
    setSearchQuery,
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

function Home() {
    const dispatch = useDispatch()

    const activeFilter = useSelector((state) => state.lead.activeFilter)
    const searchQuery = useSelector((state) => state.lead.searchQuery)
    const selectedLeadId = useSelector((state) => state.lead.selectedLeadId)
    const isAddLeadModalOpen = useSelector((state) => state.lead.isAddLeadModalOpen)
    const isTimelineDialogOpen = useSelector((state) => state.lead.isTimelineDialogOpen)
    const isDarkMode = useSelector((state) => state.lead.isDarkMode)

    const { leads, isLoading, isError } = useLeads()
    const { todayLeads, otherLeads } = splitLeadsByFollowUp(leads)

    const createLead = useCreateLead()

    const handleCreateLead = (formData) => {
        createLead.mutate(formData)
    }

    if (isLoading) {
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
                    onFilterChange={(filter) => dispatch(setActiveFilter(filter))}
                />
                <LeadList
                    leads={otherLeads}
                    todayLeads={todayLeads}
                    onLeadClick={(lead) => dispatch(openTimelineDialog(lead._id))}
                    searchQuery={searchQuery}
                    onSearchChange={(query) => dispatch(setSearchQuery(query))}
                />
            </div>

            <AddLeadModal
                isOpen={isAddLeadModalOpen}
                onClose={() => dispatch(closeAddLeadModal())}
                onSubmit={handleCreateLead}
                isLoading={createLead.isPending}
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