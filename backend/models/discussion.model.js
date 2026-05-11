import mongoose, { Schema } from "mongoose";

const discussionSchema = new Schema(
    {
        lead: {
            type: Schema.Types.ObjectId,
            ref: "Lead",
            required: true
        },
        note: {
            type: String,
            required: true,
            trim: true
        },
        followUpDate: {
            type: Date
        }
    },
    { timestamps: true }
)

export const Discussion = mongoose.model("Discussion", discussionSchema);