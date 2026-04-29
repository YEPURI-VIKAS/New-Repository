import { Router } from "express";
import { getCollege, listColleges } from "../controllers/collegesController";

export const collegesRouter = Router();

collegesRouter.get("/colleges", listColleges);
collegesRouter.get("/colleges/:id", getCollege);

