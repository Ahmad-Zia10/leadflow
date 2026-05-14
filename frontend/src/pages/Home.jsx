import { useState } from "react"
import Header from "../components/Header/Header"
import FilterBar from "../components/core/FilterBar"
import LeadList from "../components/Container/LeadList/LeadList"
import AddLeadModal from "../components/core/AddLeadModal"
import TimelineDialog from "../components/core/TimelineDialog"

const dummyLeads = [
    {
        _id: "1",
        name: "Sarah Connor",
        company: "Acme Corp",
        phone: "555-0199",
        status: "Proposal Sent",
        lastDiscussionNote: "Sent pricing tier PDF. Said she would review with her boss.",
        lastDiscussionAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(),
    },
    {
        _id: "2",
        name: "Bill Lumbergh",
        company: "Initech",
        phone: "555-0162",
        status: "Contacted",
        lastDiscussionNote: "Left a voicemail with his assistant.",
        lastDiscussionAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        _id: "3",
        name: "Hank Scorpio",
        company: "Globex",
        phone: "555-0147",
        status: "New",
        lastDiscussionNote: "Inbound lead from website contact form.",
        lastDiscussionAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        followUpDate: null,
    },
    {
        _id: "4",
        name: "Bruce Wayne",
        company: "Wayne Enterprises",
        phone: "555-0189",
        status: "Won",
        lastDiscussionNote: "Contract signed! Sending welcome package.",
        lastDiscussionAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        followUpDate: null,
    }
]

const dummyDiscussions = [
    {
        _id: "1",
        note: "Sent pricing tier PDF. Said she would review with her boss.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(),
    },
    {
        _id: "2",
        note: "Initial discovery call. They need a CRM for 50 reps.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        followUpDate: null,
    },
    {
        _id: "3",
        note: "Lead created via web form.",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        followUpDate: null,
    }
]

function Home({ isDarkMode, onToggleTheme }) {
    const [activeFilter, setActiveFilter] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState(null)

    const todayLeads = dummyLeads.filter((lead) => {
        if (!lead.followUpDate) return false
        const d = new Date(lead.followUpDate)
        const now = new Date()
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate()
        )
    })

    const otherLeads = dummyLeads.filter(
        (lead) => !todayLeads.find((t) => t._id === lead._id)
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">

            {/* Header */}
            <Header
                onAddLeadClick={() => setIsModalOpen(true)}
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
            />

            {/* Main content */}
            <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
                <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
                <LeadList
                    leads={otherLeads}
                    todayLeads={todayLeads}
                    onLeadClick={(lead) => {
                        setSelectedLead(lead)
                        setIsDialogOpen(true)
                    }}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            {/* Add Lead Modal */}
            <AddLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => console.log(data)}
                isLoading={false}
            />

            {/* Timeline Dialog */}
            <TimelineDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                lead={selectedLead}
                discussions={dummyDiscussions}
                onStatusChange={(status) => console.log(status)}
                onAddDiscussion={(data) => console.log(data)}
                isLoading={false}
            />
        </div>
    )
}

export default Home