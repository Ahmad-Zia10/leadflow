/**
 * Converts a date to a human-readable "time ago" string.
 * Used on lead cards to show when the last discussion happened.
 * e.g. "2 hours ago", "3 days ago", "1 week ago"
 */
export function timeAgo(date) {
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

/**
 * Checks if a given date is today.
 * Used to determine if a lead's follow-up should be pinned
 * in the "Today's Follow-ups" section.
 */
export function isToday(date) {
    if (!date) return false;
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}

/**
 * Checks if a given date is in the past and not today.
 * Used to highlight overdue follow-ups in red on lead cards.
 */
export function isOverdue(date) {
    if (!date) return false;
    const d = date instanceof Date ? date : new Date(date);
    return d.getTime() < Date.now() && !isToday(d);
}

/**
 * Formats a date to a readable time string.
 * Used to display follow-up time on lead cards.
 * e.g. "2:00 PM"
 */
export function formatTime(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/**
 * Formats a date to a readable date+time string.
 * Used in the timeline dialog to show when each discussion happened.
 * e.g. "May 10, 2:30 PM"
 */
export function fmtDateTime(date) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

/**
 * Combines a date string and time string into a single ISO date string.
 * Used when saving a discussion with a follow-up date + time.
 * e.g. ("2026-05-20", "14:00") → "2026-05-20T14:00:00.000Z"
 */
export function combineDateAndTime(date, time) {
    if (!date) return null;
    const combined = time ? `${date}T${time}` : `${date}T00:00`;
    return new Date(combined).toISOString();
}

/**
 * Separates today's follow-up leads from the rest.
 * Used in Home.jsx to split leads into two sections:
 * "Today's Follow-ups" and "All Leads"
 * Returns { todayLeads, otherLeads }
 */
export function splitLeadsByFollowUp(leads = []) {
    const todayLeads = leads.filter((lead) => isToday(lead.followUpDate));
    const otherLeads = leads.filter((lead) => !isToday(lead.followUpDate));
    return { todayLeads, otherLeads };
}