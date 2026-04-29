"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSavedCollege = toggleSavedCollege;
exports.listSavedColleges = listSavedColleges;
const zod_1 = require("zod");
const collegeRepository_1 = require("../db/collegeRepository");
const userStore_1 = require("../db/userStore");
const saveSchema = zod_1.z.object({
    collegeId: zod_1.z.string().min(1),
});
async function toggleSavedCollege(req, res) {
    const parsed = saveSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }
    const user = req.user;
    if (!user?.id)
        return res.status(401).json({ message: "Unauthorized" });
    const college = (0, collegeRepository_1.getCollegeById)(parsed.data.collegeId);
    if (!college)
        return res.status(404).json({ message: "College not found" });
    const currentIds = await (0, userStore_1.getSavedCollegeIds)(user.id);
    const exists = currentIds.includes(college.id);
    const nextIds = exists ? currentIds.filter((id) => id !== college.id) : [...currentIds, college.id];
    await (0, userStore_1.setSavedCollegeIds)(user.id, nextIds);
    return res.status(200).json({ saved: !exists, collegeId: college.id, savedIds: nextIds });
}
async function listSavedColleges(req, res) {
    const user = req.user;
    if (!user?.id)
        return res.status(401).json({ message: "Unauthorized" });
    const ids = await (0, userStore_1.getSavedCollegeIds)(user.id);
    const colleges = ids.map((id) => (0, collegeRepository_1.getCollegeById)(id)).filter(Boolean);
    return res.status(200).json({ items: colleges });
}
//# sourceMappingURL=savedController.js.map