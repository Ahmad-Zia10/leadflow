import { Discussion } from "../models/discussion.model.js";
import { Lead } from "../models/lead.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/v1/leads/:leadId/discussions
const getDiscussionsByLead = asyncHandler(async (req, res) => {
    const { leadId } = req.params;

    if (!leadId) {
        throw new apiError(400, "Lead ID is required");
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
        throw new apiError(404, "Lead not found");
    }

    const discussions = await Discussion.find({ lead: leadId })
        .sort({ createdAt: -1 });

    if (!discussions) {
        throw new apiError(500, "Discussions could not be fetched from database");
    }

    return res
        .status(200)
        .json(new apiResponse(200, discussions, "Discussions fetched successfully"));
});

// POST /api/v1/leads/:leadId/discussions
const addDiscussion = asyncHandler(async (req, res) => {
    const { leadId } = req.params;
    const { note, followUpDate } = req.body;

    if (!leadId) {
        throw new apiError(400, "Lead ID is required");
    }

    // Validate required field
    if (!note || note.trim() === "") {
        throw new apiError(400, "Discussion note is required");
    }

    // Validate followUpDate if provided
    if (followUpDate && isNaN(new Date(followUpDate).getTime())) {
        throw new apiError(400, "Invalid follow-up date provided");
    }

    // Check follow-up date is not in the past
    if (followUpDate && new Date(followUpDate) < new Date()) {
        throw new apiError(400, "Follow-up date cannot be in the past");
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
        throw new apiError(404, "Lead not found");
    }

    const discussion = await Discussion.create({
        lead: leadId,
        note: note.trim(),
        followUpDate: followUpDate || null
    });

    if (!discussion) {
        throw new apiError(500, "Discussion could not be created in database");
    }

    // Update denormalized fields on lead
    lead.lastDiscussionNote = note.trim();
    lead.lastDiscussionAt = discussion.createdAt;
    if (followUpDate) lead.followUpDate = new Date(followUpDate);

    await lead.save();

    return res
        .status(201)
        .json(new apiResponse(201, discussion, "Discussion added successfully"));
});

export {
    getDiscussionsByLead,
    addDiscussion
};