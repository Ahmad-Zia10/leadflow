import StatusBadge from "../../core/StatusBadge";

function timeAgo(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(mins, 1)} minute${mins === 1 ? "" : "s"} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

function isToday(date) {
    if (!date) return false;
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}

function isOverdue(date) {
    if (!date) return false;
    const d = date instanceof Date ? date : new Date(date);
    return d.getTime() < Date.now() && !isToday(d);
}

function formatTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function LeadCard({ lead, onLeadClick }) {
    const overdue = isOverdue(lead.followUpDate);
    const today = isToday(lead.followUpDate);

    return (
        <div
            onClick={() => onLeadClick?.(lead)}
            className={`
                relative rounded-xl border cursor-pointer p-4
                transition-all duration-200
                bg-white dark:bg-[#13131a]
                hover:shadow-lg hover:shadow-indigo-500/10
                hover:-translate-y-0.5
                ${overdue
                    ? "border-l-4 border-l-red-500 border-t-red-200/50 border-r-red-200/50 border-b-red-200/50 dark:border-t-red-500/20 dark:border-r-red-500/20 dark:border-b-red-500/20 bg-red-50/30 dark:bg-red-500/5"
                    : "border-gray-200 dark:border-white/8 hover:border-indigo-300 dark:hover:border-indigo-500/30"
                }
            `}
        >
            <div className="flex items-start justify-between gap-4">

                {/* Left side */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {lead.name}
                        </h3>
                        {lead.company && (
                            <span className="text-sm text-gray-400 dark:text-slate-500">
                                ({lead.company})
                            </span>
                        )}
                    </div>

                    {lead.lastDiscussionNote && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400 line-clamp-1">
                            <span className="font-medium text-gray-700 dark:text-slate-300">
                                Last Note:
                            </span>{" "}
                            {lead.lastDiscussionNote}
                            {lead.lastDiscussionAt && (
                                <span className="ml-2 text-xs text-gray-400 dark:text-slate-600">
                                    {timeAgo(lead.lastDiscussionAt)}
                                </span>
                            )}
                        </p>
                    )}

                    {/* Today follow-up */}
                    {today && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold px-2.5 py-1 rounded-lg">
                            ⚠️ Follow-up today at {formatTime(lead.followUpDate)}
                        </div>
                    )}

                    {/* Overdue follow-up */}
                    {overdue && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs font-semibold px-2.5 py-1 rounded-lg">
                            ⚠️ Overdue follow-up — {timeAgo(lead.followUpDate)}
                        </div>
                    )}
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={lead.status} />
                </div>
            </div>
        </div>
    );
}

export default LeadCard;