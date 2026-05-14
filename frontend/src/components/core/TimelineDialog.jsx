import { useState } from "react";
import { X, Phone, Calendar } from "lucide-react";
import { useLeadById, useDiscussions, useUpdateLead, useAddDiscussion } from "../../hooks/useLeads";
import { fmtDateTime, timeAgo, combineDateAndTime } from "../../utils/helpers";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

function TimelineDialog({ isOpen, onClose, leadId }) {
    const [showFollowUp, setShowFollowUp] = useState(false);

    const { lead, isLoading: leadLoading } = useLeadById(leadId);
    const { discussions, isLoading: discussionsLoading } = useDiscussions(leadId);
    const updateLead = useUpdateLead();
    const addDiscussion = useAddDiscussion();

    if (!isOpen) return null;

    if (leadLoading || discussionsLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!lead) return null;

    const handleStatusChange = (newStatus) => {
        updateLead.mutate({ id: lead._id, status: newStatus });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const note = fd.get("note");
        const followUpDate = showFollowUp
            ? combineDateAndTime(fd.get("followUpDate"), fd.get("followUpTime"))
            : null;

        addDiscussion.mutate(
            { leadId: lead._id, note, followUpDate },
            {
                onSuccess: () => {
                    e.target.reset();
                    setShowFollowUp(false);
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <div className="w-full max-w-2xl max-h-[85vh] flex flex-col
                bg-white dark:bg-[#13131a]
                border border-gray-200 dark:border-white/10
                rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/60"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-white/8 shrink-0">
                    <div className="min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {lead.name}
                            </h2>
                            {lead.company && (
                                <span className="text-sm text-gray-400 dark:text-slate-400">
                                    ({lead.company})
                                </span>
                            )}
                        </div>
                        {lead.phone && (
                            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-400">
                                <Phone className="w-3.5 h-3.5" />
                                {lead.phone}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={updateLead.isPending}
                            className="rounded-lg px-2.5 py-1.5 text-sm font-medium
                                bg-gray-100 dark:bg-white/5
                                border border-gray-200 dark:border-white/10
                                text-gray-700 dark:text-white
                                focus:outline-none
                                focus:border-indigo-400 dark:focus:border-indigo-500/50
                                focus:ring-2 focus:ring-indigo-500/20
                                disabled:opacity-50
                                transition-all duration-200"
                        >
                            {STATUSES.map((s) => (
                                <option
                                    key={s}
                                    value={s}
                                    className="bg-white dark:bg-[#13131a]"
                                >
                                    {s}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg
                                text-gray-400 dark:text-slate-500
                                hover:text-gray-600 dark:hover:text-white
                                hover:bg-gray-100 dark:hover:bg-white/10
                                transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div className="relative pl-6">
                        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10" />
                        <div className="space-y-5">
                            {discussions.length > 0 ? discussions.map((d, idx) => (
                                <div key={d._id} className="relative">
                                    <span className={
                                        idx === 0
                                            ? "absolute -left-[14px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/50"
                                            : "absolute -left-[14px] top-1.5 w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-700 border border-gray-200 dark:border-white/10"
                                    } />
                                    <div className="text-xs text-gray-400 dark:text-slate-400 mb-1.5">
                                        {fmtDateTime(d.createdAt)}{" "}
                                        <span className="text-gray-300 dark:text-slate-600">
                                            ({timeAgo(d.createdAt)})
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3">
                                        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                                            {d.note}
                                        </p>
                                        {d.followUpDate && (
                                            <div className="mt-2 inline-flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 text-xs font-medium">
                                                <Calendar className="w-3 h-3" />
                                                Follow-up: {fmtDateTime(d.followUpDate)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-400 dark:text-slate-500">
                                        No discussions yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom form */}
                <form
                    onSubmit={handleSubmit}
                    className="border-t border-gray-100 dark:border-white/8 p-5 space-y-3 shrink-0"
                >
                    <textarea
                        name="note"
                        required
                        placeholder="Log a new discussion..."
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm resize-none
                            bg-gray-50 dark:bg-white/5
                            border border-gray-200 dark:border-white/10
                            text-gray-900 dark:text-white
                            placeholder-gray-400 dark:placeholder-slate-500
                            focus:outline-none focus:ring-2
                            focus:ring-indigo-500/30 dark:focus:ring-indigo-500/20
                            focus:border-indigo-400 dark:focus:border-indigo-500/50
                            transition-all duration-200"
                    />

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showFollowUp}
                                    onChange={(e) => setShowFollowUp(e.target.checked)}
                                    className="w-4 h-4 rounded accent-indigo-500"
                                />
                                Set Follow-up
                            </label>

                            {showFollowUp && (
                                <>
                                    <input
                                        type="date"
                                        name="followUpDate"
                                        className="rounded-lg px-2.5 py-1.5 text-sm
                                            bg-gray-100 dark:bg-white/5
                                            border border-gray-200 dark:border-white/10
                                            text-gray-700 dark:text-white
                                            focus:outline-none
                                            focus:border-indigo-400 dark:focus:border-indigo-500/50
                                            [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                    <input
                                        type="time"
                                        name="followUpTime"
                                        className="rounded-lg px-2.5 py-1.5 text-sm
                                            bg-gray-100 dark:bg-white/5
                                            border border-gray-200 dark:border-white/10
                                            text-gray-700 dark:text-white
                                            focus:outline-none
                                            focus:border-indigo-400 dark:focus:border-indigo-500/50
                                            [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={addDiscussion.isPending}
                            className="px-4 py-2 text-sm font-semibold text-white rounded-xl
                                bg-gradient-to-r from-indigo-600 to-violet-600
                                hover:from-indigo-500 hover:to-violet-500
                                shadow-lg shadow-indigo-500/25
                                hover:shadow-indigo-500/40
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200"
                        >
                            {addDiscussion.isPending ? "Saving..." : "Save Note"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TimelineDialog;