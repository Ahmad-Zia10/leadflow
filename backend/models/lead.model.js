import mongoose, { Schema } from "mongoose";
import { LEAD_STATUS, LEAD_STATUS_VALUES } from "../constants.js";

const leadSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: LEAD_STATUS_VALUES,
            default: LEAD_STATUS.NEW
        },
        followUpDate: {
            type: Date
        },
        lastDiscussionNote: {
            type: String
        },
        lastDiscussionAt: {
            type: Date
        }
    },
    { timestamps: true }
)

export const Lead = mongoose.model("Lead", leadSchema);