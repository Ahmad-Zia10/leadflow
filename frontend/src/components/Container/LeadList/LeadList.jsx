import { Search } from "lucide-react";
import LeadCard from "../LeadCard/LeadCard";

function LeadList({ leads = [], todayLeads = [], onLeadClick, searchQuery, onSearchChange }) {
    const hasAny = leads.length > 0 || todayLeads.length > 0;

    return (
        <div className="space-y-6">

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={searchQuery || ""}
                    onChange={(e) => onSearchChange?.(e.target.value)}
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

            {/* Today's Follow-ups */}
            {todayLeads.length > 0 && (
                <section>
                    <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-slate-500 mb-3">
                        📍 Today's Follow-ups
                    </h2>
                    <div className="space-y-3">
                        {todayLeads.map((lead) => (
                            <div
                                key={lead._id}
                                className="rounded-xl p-0.5 bg-linear-to-r from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10"
                            >
                                <LeadCard lead={lead} onLeadClick={onLeadClick} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Leads */}
            <section>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-slate-500 mb-3">
                    All Leads
                </h2>
                {leads.length > 0 ? (
                    <div className="space-y-3">
                        {leads.map((lead) => (
                            <LeadCard
                                key={lead._id}
                                lead={lead}
                                onLeadClick={onLeadClick}
                            />
                        ))}
                    </div>
                ) : (
                    !hasAny && (
                        <div className="rounded-xl border border-dashed
                            border-gray-200 dark:border-white/10
                            bg-white dark:bg-white/3
                            p-12 text-center"
                        >
                            <div className="text-3xl mb-3">🔍</div>
                            <p className="text-gray-500 dark:text-slate-500 text-sm font-medium">
                                No leads found
                            </p>
                            <p className="text-gray-400 dark:text-slate-600 text-xs mt-1">
                                Add a new lead to get started
                            </p>
                        </div>
                    )
                )}
            </section>
        </div>
    );
}

export default LeadList;