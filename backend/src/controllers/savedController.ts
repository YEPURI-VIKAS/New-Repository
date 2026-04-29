import type { Request, Response } from "express";
import { z } from "zod";
import { getCollegeById } from "../db/collegeRepository";
import { getSavedCollegeIds, setSavedCollegeIds } from "../db/userStore";

const saveSchema = z.object({
  collegeId: z.string().min(1),
});

export async function toggleSavedCollege(req: Request, res: Response) {
  const parsed = saveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
  }

  const user = (req as any).user as { id: string } | undefined;
  if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

  const college = getCollegeById(parsed.data.collegeId);
  if (!college) return res.status(404).json({ message: "College not found" });

  const currentIds = await getSavedCollegeIds(user.id);
  const exists = currentIds.includes(college.id);
  const nextIds = exists ? currentIds.filter((id) => id !== college.id) : [...currentIds, college.id];

  await setSavedCollegeIds(user.id, nextIds);
  return res.status(200).json({ saved: !exists, collegeId: college.id, savedIds: nextIds });
}

export async function listSavedColleges(req: Request, res: Response) {
  const user = (req as any).user as { id: string } | undefined;
  if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

  const ids = await getSavedCollegeIds(user.id);
  const colleges = ids.map((id) => getCollegeById(id)).filter(Boolean);

  return res.status(200).json({ items: colleges });
}

