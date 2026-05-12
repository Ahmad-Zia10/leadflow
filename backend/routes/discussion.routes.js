import { Router } from "express";
import {
    getDiscussionsByLead,
    addDiscussion
} from "../controllers/discussion.controller.js";

const router = Router();

router.get("/:leadId/discussions", getDiscussionsByLead);
router.post("/:leadId/discussions", addDiscussion);

export default router;