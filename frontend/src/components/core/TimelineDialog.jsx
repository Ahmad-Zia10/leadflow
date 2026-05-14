import { useState } from "react";
import { X, Phone, Calendar } from "lucide-react";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

function fmtDateTime(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function timeAgo(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        return `${Math.max(hours, 1)}h ago`;
    }
    return `${days}d ago`;
}

function TimelineDialog({
    isOpen,
    onClose,
    lead,
    discussions = [],
    onStatusChange,
    onAddDiscussion,
    isLoading,
}) {
    const [showFollowUp, setShowFollowUp] = useState(false);

    if (!isOpen || !lead) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onAddDiscussion?.({
            note: fd.get("note"),
            followUpDate: showFollowUp ? fd.get("followUpDate") : null,
            followUpTime: showFollowUp ? fd.get("followUpTime") : null,
        });
        e.currentTarget.reset();
        setShowFollowUp(false);
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
                        {/* Status dropdown */}
                        <select
                            value={lead.status}
                            onChange={(e) => onStatusChange?.(e.target.value)}
                            className="rounded-lg px-2.5 py-1.5 text-sm font-medium
                                bg-gray-100 dark:bg-white/5
                                border border-gray-200 dark:border-white/10
                                text-gray-700 dark:text-white
                                focus:outline-none
                                focus:border-indigo-400 dark:focus:border-indigo-500/50
                                focus:ring-2 focus:ring-indigo-500/20
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

                        {/* Close button */}
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
                        {/* Vertical line */}
                        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10" />

                        <div className="space-y-5">
                            {discussions.length > 0 ? discussions.map((d, idx) => (
                                <div key={d._id} className="relative">
                                    {/* Timeline dot */}
                                    <span className={
                                        idx === 0
                                            ? "absolute -left-3.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-500/20 shadow-lg shadow-indigo-500/50"
                                            : "absolute -left-3.5 top-1.5 w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-700 border border-gray-200 dark:border-white/10"
                                    } />

                                    {/* Date/time */}
                                    <div className="text-xs text-gray-400 dark:text-slate-400 mb-1.5">
                                        {fmtDateTime(d.createdAt)}{" "}
                                        <span className="text-gray-300 dark:text-slate-600">
                                            ({timeAgo(d.createdAt)})
                                        </span>
                                    </div>

                                    {/* Note card */}
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
                            {/* Follow-up checkbox */}
                            <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showFollowUp}
                                    onChange={(e) => setShowFollowUp(e.target.checked)}
                                    className="w-4 h-4 rounded accent-indigo-500"
                                />
                                Set Follow-up
                            </label>

                            {/* Date/time inputs */}
                            {showFollowUp && (
                                <>
                                    <input
                                        type="date"
                                        name="followUpDate"
                                        className="rounded-lg px-2.5 py-1.5 text-sm
                                            bg-gray-100 dark:bg-white/5
                                            border border-gray-200 dark:border-white/10
                                            text-gray-700 dark:text-white
                                            focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50
                                            scheme-light dark:scheme-dark"
                                    />
                                    <input
                                        type="time"
                                        name="followUpTime"
                                        className="rounded-lg px-2.5 py-1.5 text-sm
                                            bg-gray-100 dark:bg-white/5
                                            border border-gray-200 dark:border-white/10
                                            text-gray-700 dark:text-white
                                            focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50
                                            scheme-light dark:scheme-dark"
                                    />
                                </>
                            )}
                        </div>

                        {/* Save button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-white rounded-xl
                                bg-linear-to-r from-indigo-600 to-violet-600
                                hover:from-indigo-500 hover:to-violet-500
                                shadow-lg shadow-indigo-500/25
                                hover:shadow-indigo-500/40
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200"
                        >
                            {isLoading ? "Saving..." : "Save Note"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TimelineDialog;