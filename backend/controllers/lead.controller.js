import { Lead } from "../models/lead.model.js";
import { Discussion } from "../models/discussion.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { LEAD_STATUS_VALUES } from "../constants.js";

// GET /api/v1/leads
const getAllLeads = asyncHandler(async (req, res) => {
    const { status, search } = req.query;

    const filter = {};

    if (status && status !== "All") {
        if (!LEAD_STATUS_VALUES.includes(status)) {
            throw new apiError(400, `Invalid status value. Must be one of: ${LEAD_STATUS_VALUES.join(", ")}`);
        }
        filter.status = status;
    }

    if (search && search.trim() !== "") {
        filter.name = { $regex: search.trim(), $options: "i" };
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    if (!leads) {
        throw new apiError(500, "Leads could not be fetched from database");
    }

    return res
        .status(200)
        .json(new apiResponse(200, leads, "Leads fetched successfully"));
});

// GET /api/v1/leads/:id
const getLeadById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new apiError(400, "Lead ID is required");
    }

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new apiError(404, "Lead not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, lead, "Lead fetched successfully"));
});

// POST /api/v1/leads
const createLead = asyncHandler(async (req, res) => {
    const { name, company, phone, status } = req.body;

    // Validate required field
    if (!name || name.trim() === "") {
        throw new apiError(400, "Lead name is required");
    }

    // Validate status if provided
    if (status && !LEAD_STATUS_VALUES.includes(status)) {
        throw new apiError(400, `Invalid status value. Must be one of: ${LEAD_STATUS_VALUES.join(", ")}`);
    }

    // Check if lead with same name and company already exists
    const existingLead = await Lead.findOne({
        name: { $regex: `^${name.trim()}$`, $options: "i" },
        company: company ? { $regex: `^${company.trim()}$`, $options: "i" } : null
    });

    if (existingLead) {
        throw new apiError(409, "A lead with this name and company already exists");
    }

    const lead = await Lead.create({
        name: name.trim(),
        company: company?.trim(),
        phone: phone?.trim(),
        status
    });

    if (!lead) {
        throw new apiError(500, "Lead could not be created in database");
    }

    return res
        .status(201)
        .json(new apiResponse(201, lead, "Lead created successfully"));
});

// PATCH /api/v1/leads/:id
const updateLead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, followUpDate } = req.body;

    if (!id) {
        throw new apiError(400, "Lead ID is required");
    }

    // At least one field must be provided
    if (!status && followUpDate === undefined) {
        throw new apiError(400, "At least one field (status or followUpDate) is required to update");
    }

    // Validate status if provided
    if (status && !LEAD_STATUS_VALUES.includes(status)) {
        throw new apiError(400, `Invalid status value. Must be one of: ${LEAD_STATUS_VALUES.join(", ")}`);
    }

    // Validate followUpDate if provided
    if (followUpDate && isNaN(new Date(followUpDate).getTime())) {
        throw new apiError(400, "Invalid follow-up date provided");
    }

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new apiError(404, "Lead not found");
    }

    if (status) lead.status = status;
    if (followUpDate !== undefined) lead.followUpDate = followUpDate || null;

    await lead.save();

    return res
        .status(200)
        .json(new apiResponse(200, lead, "Lead updated successfully"));
});

// DELETE /api/v1/leads/:id
const deleteLead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new apiError(400, "Lead ID is required");
    }

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new apiError(404, "Lead not found");
    }

    try {
        await Lead.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error deleting lead:", error);
        throw new apiError(500, "Lead could not be deleted from database");
    }

    try {
        const deletedDiscussions = await Discussion.deleteMany({ lead: id });
        console.log(`Deleted ${deletedDiscussions.deletedCount} discussions for lead ${id}`);
    } catch (error) {
        console.error("Error deleting discussions for lead:", id, error);
        throw new apiError(500, "Discussions could not be deleted from database");
    }

    return res
        .status(200)
        .json(new apiResponse(200, null, "Lead and associated discussions deleted successfully"));
});

export {
    getAllLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
};