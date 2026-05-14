import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import dotenv from "dotenv"

dotenv.config()

// Route imports
import leadRouter from "./routes/lead.routes.js";
import discussionRouter from "./routes/discussion.routes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/leads", discussionRouter);

// Health check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ success: true, message: "LeadFlow API is running" });
});

// Error handler — must be last
app.use(errorHandler);

export default app;