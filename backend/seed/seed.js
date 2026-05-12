import dotenv from "dotenv";
import mongoose from "mongoose";
import { Lead } from "../models/lead.model.js";
import { Discussion } from "../models/discussion.model.js";
import { LEAD_STATUS } from "../constants.js";

dotenv.config();

const today = new Date();

const getDate = (daysOffset, hours = 10, minutes = 0) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

const leadsData = [
    {
        name: "Sarah Connor",
        company: "Acme Corp",
        phone: "555-0199",
        status: LEAD_STATUS.PROPOSAL_SENT,
        followUpDate: getDate(0, 14, 0), // today at 2:00 PM - tests pinning
    },
    {
        name: "Hank Scorpio",
        company: "Globex",
        phone: "555-0147",
        status: LEAD_STATUS.NEW,
        followUpDate: null
    },
    {
        name: "Bill Lumbergh",
        company: "Initech",
        phone: "555-0162",
        status: LEAD_STATUS.CONTACTED,
        followUpDate: getDate(-2, 10, 0), // 2 days ago - tests overdue red highlight
    },
    {
        name: "Bruce Wayne",
        company: "Wayne Enterprises",
        phone: "555-0189",
        status: LEAD_STATUS.WON,
        followUpDate: null
    },
    {
        name: "Michael Scott",
        company: "Dunder Mifflin",
        phone: "555-0173",
        status: LEAD_STATUS.QUALIFIED,
        followUpDate: getDate(1, 11, 0), // tomorrow - upcoming follow-up
    },
    {
        name: "Regina George",
        company: "Plastics Inc",
        phone: "555-0134",
        status: LEAD_STATUS.LOST,
        followUpDate: null
    }
];

const discussionsData = [
    // Sarah Connor - 3 discussions
    {
        leadName: "Sarah Connor",
        discussions: [
            {
                note: "Lead created via web form.",
                createdAt: getDate(-6, 16, 0),
                followUpDate: null
            },
            {
                note: "Initial discovery call. They need a CRM for 50 reps. Pain points include dropping leads and no follow-up tracking.",
                createdAt: getDate(-5, 9, 0),
                followUpDate: null
            },
            {
                note: "Sent pricing tier PDF. Said she would review with her boss.",
                createdAt: getDate(-2, 10, 30),
                followUpDate: getDate(0, 14, 0)
            }
        ]
    },
    // Hank Scorpio - 1 discussion
    {
        leadName: "Hank Scorpio",
        discussions: [
            {
                note: "Inbound lead from website contact form.",
                createdAt: getDate(0, -2, 0),
                followUpDate: null
            }
        ]
    },
    // Bill Lumbergh - 2 discussions
    {
        leadName: "Bill Lumbergh",
        discussions: [
            {
                note: "Cold outreach via LinkedIn. Showed interest in the enterprise plan.",
                createdAt: getDate(-8, 11, 0),
                followUpDate: null
            },
            {
                note: "Left a voicemail with his assistant. Waiting for callback.",
                createdAt: getDate(-7, 15, 0),
                followUpDate: getDate(-2, 10, 0)
            }
        ]
    },
    // Bruce Wayne - 2 discussions
    {
        leadName: "Bruce Wayne",
        discussions: [
            {
                note: "Initial call. Very interested, needs solution for entire organization.",
                createdAt: getDate(-30, 10, 0),
                followUpDate: null
            },
            {
                note: "Contract signed! Sending welcome package.",
                createdAt: getDate(-21, 14, 0),
                followUpDate: null
            }
        ]
    },
    // Michael Scott - 2 discussions
    {
        leadName: "Michael Scott",
        discussions: [
            {
                note: "Referral from existing client. Looking for team collaboration features.",
                createdAt: getDate(-4, 9, 0),
                followUpDate: null
            },
            {
                note: "Demo call went well. Wants to loop in his regional manager before deciding.",
                createdAt: getDate(-1, 16, 0),
                followUpDate: getDate(1, 11, 0)
            }
        ]
    },
    // Regina George - 2 discussions
    {
        leadName: "Regina George",
        discussions: [
            {
                note: "Reached out via email. Seemed interested initially.",
                createdAt: getDate(-14, 10, 0),
                followUpDate: null
            },
            {
                note: "Follow-up call. She said they went with a competitor. Marking as lost.",
                createdAt: getDate(-10, 11, 0),
                followUpDate: null
            }
        ]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected for seeding...");

        // Clear existing data
        await Lead.deleteMany({});
        await Discussion.deleteMany({});
        console.log("Cleared existing leads and discussions");

        // Create leads
        const createdLeads = await Lead.insertMany(leadsData);
        console.log(`Created ${createdLeads.length} leads`);

        // Map lead name to lead document for easy lookup
        const leadMap = {};
        createdLeads.forEach((lead) => {
            leadMap[lead.name] = lead;
        });

        // Create discussions and update lead denormalized fields
        for (const leadDiscussions of discussionsData) {
            const lead = leadMap[leadDiscussions.leadName];

            if (!lead) {
                console.warn(`Lead not found for: ${leadDiscussions.leadName}`);
                continue;
            }

            // Create discussions with correct leadId and createdAt
            const createdDiscussions = [];

            for (const discussion of leadDiscussions.discussions) {
                const created = await Discussion.create({
                    lead: lead._id,
                    note: discussion.note,
                    followUpDate: discussion.followUpDate,
                    createdAt: discussion.createdAt
                });
                createdDiscussions.push(created);
            }

            // Sort to get the most recent discussion
            const sortedDiscussions = createdDiscussions.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            const latestDiscussion = sortedDiscussions[0];

            // Update denormalized fields on lead
            await Lead.findByIdAndUpdate(lead._id, {
                lastDiscussionNote: latestDiscussion.note,
                lastDiscussionAt: latestDiscussion.createdAt
            });

            console.log(`Created ${createdDiscussions.length} discussions for ${lead.name}`);
        }

        console.log("----------------------------------");
        console.log("Database seeded successfully");
        console.log("----------------------------------");
        console.log("Leads created:");
        createdLeads.forEach((lead) => {
            console.log(`  - ${lead.name} (${lead.status})`);
        });
        console.log("----------------------------------");

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected after seeding");
    }
}

seedDatabase();