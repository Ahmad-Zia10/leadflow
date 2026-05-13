import axiosInstance from "./apiConnector";
import { LEAD_ENDPOINTS, DISCUSSION_ENDPOINTS } from "./apis";

// Lead APIs
export const getAllLeads = async ({ status, search } = {}) => {
    const params = {};
    if (status && status !== "All") params.status = status;
    if (search && search.trim() !== "") params.search = search.trim();

    const response = await axiosInstance.get(LEAD_ENDPOINTS.GET_ALL_LEADS, { params });
    return response.data;
};

export const getLeadById = async (id) => {
    const response = await axiosInstance.get(LEAD_ENDPOINTS.GET_LEAD_BY_ID(id));
    return response.data;
};

export const createLead = async (leadData) => {
    const response = await axiosInstance.post(LEAD_ENDPOINTS.CREATE_LEAD, leadData);
    return response.data;
};

export const updateLead = async ({ id, ...updateData }) => {
    const response = await axiosInstance.patch(LEAD_ENDPOINTS.UPDATE_LEAD(id), updateData);
    return response.data;
};

export const deleteLead = async (id) => {
    const response = await axiosInstance.delete(LEAD_ENDPOINTS.DELETE_LEAD(id));
    return response.data;
};

// Discussion APIs
export const getDiscussionsByLead = async (leadId) => {
    const response = await axiosInstance.get(DISCUSSION_ENDPOINTS.GET_DISCUSSIONS(leadId));
    return response.data;
};

export const addDiscussion = async ({ leadId, ...discussionData }) => {
    const response = await axiosInstance.post(DISCUSSION_ENDPOINTS.ADD_DISCUSSION(leadId), discussionData);
    return response.data;
};