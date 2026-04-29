import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { listSavedColleges, toggleSavedCollege } from "../controllers/savedController";

export const savedRouter = Router();

savedRouter.post("/save-college", requireAuth, toggleSavedCollege);
savedRouter.get("/saved-colleges", requireAuth, listSavedColleges);

