import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { closeAddLeadModal, closeTimelineDialog } from "../store/leadSlice";
import {
    getAllLeads,
    getLeadById,
    getDiscussionsByLead,
    createLead,
    updateLead,
    addDiscussion,
} from "../services/leadApi";

/**
 * QUERY KEYS
 * Centralized query key definitions.
 * React Query uses these keys to identify and manage cached data.
 */

export const QUERY_KEYS = {
    leads: (filters = {}) => ["leads", filters],
    lead: (id) => ["lead", id],
    discussions: (leadId) => ["discussions", leadId],
};

export function useLeads() {
    const activeFilter = useSelector((state) => state.lead.activeFilter);
    const searchQuery = useSelector((state) => state.lead.searchQuery);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: QUERY_KEYS.leads({ status: activeFilter, search: searchQuery }),
        queryFn: () => getAllLeads({ status: activeFilter, search: searchQuery }),
        staleTime: 30 * 1000,
    });

    const leads = data?.data || [];

    return { leads, isLoading, isError, error };
}


/**
 * useLeadById
 * Fetches a single lead by ID.
 * Used inside TimelineDialog to always have fresh lead data
 * (status, followUpDate) without relying on potentially stale Redux state.
 * 
 * Why not use Redux for this?
 * If we stored the full lead object in Redux and then mutated it
 * (e.g. status change), Redux would go stale. React Query is the
 * single source of truth for server data.
 * 
 * enabled: !!leadId — only runs the query if leadId is not null/undefined.
 * Prevents unnecessary API calls when no lead is selected.
 */
export function useLeadById(leadId) {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.lead(leadId),
        queryFn: () => getLeadById(leadId),
        enabled: !!leadId,
        staleTime: 30 * 1000,
    });

    return { lead: data?.data || null, isLoading };
}


/**
 * useDiscussions
 * Fetches all discussions for a specific lead.
 * Used inside TimelineDialog to populate the timeline.
 * 
 * Sorted reverse chronologically by the backend (newest first).
 * enabled: !!leadId — only fetches when a lead is actually selected.
 */
export function useDiscussions(leadId) {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.discussions(leadId),
        queryFn: () => getDiscussionsByLead(leadId),
        enabled: !!leadId,
        staleTime: 30 * 1000,
    });

    return { discussions: data?.data || [], isLoading };
}


/**
 * useCreateLead
 * Mutation for creating a new lead via POST /api/v1/leads
 * 
 * On success:
 * 1. Invalidates the ["leads"] cache — React Query refetches the list
 * 2. Closes the Add Lead modal via Redux dispatch
 * 
 * Why invalidate instead of manually updating the cache?
 * Manually updating the cache (optimistic updates) is faster but risky —
 * if the server adds extra fields (timestamps, _id), your manual update
 * would be missing them. Invalidating forces a clean refetch.
 * Simple and always correct.
 */
export function useCreateLead() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: createLead,

        onSuccess: () => {
            /**
             * invalidateQueries with exact: false (default)
             * invalidates ALL queries whose key starts with "leads"
             * This means ["leads", { status: "New" }] and
             * ["leads", { status: "All" }] both get invalidated.
             * The active query refetches immediately.
             */
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            dispatch(closeAddLeadModal());
        },
    });
}


/**
 * useUpdateLead
 * Mutation for updating a lead's status or followUpDate
 * via PATCH /api/v1/leads/:id
 * 
 * On success:
 * 1. Invalidates ["leads"] — lead list refetches with updated status badge
 * 2. Invalidates ["lead", id] — the individual lead query refetches
 *    so TimelineDialog header shows the new status immediately
 */
export function useUpdateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLead,

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });

            /**
             * Invalidate the specific lead query by ID.
             * data.data._id comes from the API response.
             * This ensures the TimelineDialog header reflects
             * the new status without closing and reopening.
             */
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.lead(data?.data?._id)
            });
        },
    });
}


/**
 * useAddDiscussion
 * Mutation for adding a new discussion note to a lead
 * via POST /api/v1/leads/:leadId/discussions
 * 
 * On success:
 * 1. Invalidates ["discussions", leadId] — timeline refetches with new note
 * 2. Invalidates ["leads"] — lead list refetches with updated
 *    lastDiscussionNote and lastDiscussionAt on the card
 * 
 * This is the mutation that makes everything feel real-time.
 * One save updates both the dialog timeline AND the lead card simultaneously.
 */
export function useAddDiscussion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addDiscussion,

        onSuccess: (data, variables) => {
            /**
             * variables is what we passed to mutationFn.
             * variables.leadId is the lead we just added a discussion to.
             * We use it to invalidate only that lead's discussion cache,
             * not all discussions across all leads.
             */
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.discussions(variables.leadId)
            });
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });
}