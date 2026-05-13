export const LEAD_STATUS = {
    NEW: "New",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    PROPOSAL_SENT: "Proposal Sent",
    WON: "Won",
    LOST: "Lost"
}

export const LEAD_STATUS_VALUES = Object.values(LEAD_STATUS);

export const STATUS_COLORS = {
    "New": {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200"
    },
    "Contacted": {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200"
    },
    "Qualified": {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200"
    },
    "Proposal Sent": {
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-200"
    },
    "Won": {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200"
    },
    "Lost": {
        bg: "bg-gray-100",
        text: "text-gray-500",
        border: "border-gray-200"
    }
}