import { Router } from "express";
import {
    getAllLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
} from "../controllers/lead.controller.js";

const router = Router();

router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;