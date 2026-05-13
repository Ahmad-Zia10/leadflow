const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LEAD_ENDPOINTS = {
    GET_ALL_LEADS: `${BASE_URL}/leads`,
    CREATE_LEAD: `${BASE_URL}/leads`,
    GET_LEAD_BY_ID: (id) => `${BASE_URL}/leads/${id}`,
    UPDATE_LEAD: (id) => `${BASE_URL}/leads/${id}`,
    DELETE_LEAD: (id) => `${BASE_URL}/leads/${id}`,
}

export const DISCUSSION_ENDPOINTS = {
    GET_DISCUSSIONS: (leadId) => `${BASE_URL}/leads/${leadId}/discussions`,
    ADD_DISCUSSION: (leadId) => `${BASE_URL}/leads/${leadId}/discussions`,
}