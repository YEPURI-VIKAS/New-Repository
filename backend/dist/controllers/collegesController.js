"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listColleges = listColleges;
exports.getCollege = getCollege;
const collegeRepository_1 = require("../db/collegeRepository");
function parseNumber(v) {
    if (typeof v !== "string")
        return undefined;
    const n = Number(v);
    if (!Number.isFinite(n))
        return undefined;
    return n;
}
async function listColleges(req, res) {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const location = typeof req.query.location === "string" ? req.query.location : undefined;
    const course = typeof req.query.course === "string" ? req.query.course : undefined;
    const feesMin = parseNumber(req.query.feesMin);
    const feesMax = parseNumber(req.query.feesMax);
    const sortRaw = typeof req.query.sort === "string" ? req.query.sort : undefined;
    const sort = sortRaw === "fees_asc" ? "fees_asc" : "rating_desc";
    const page = parseNumber(req.query.page);
    const limit = parseNumber(req.query.limit);
    const query = { sort };
    if (q)
        query.q = q;
    if (location)
        query.location = location;
    if (course)
        query.course = course;
    if (typeof feesMin === "number")
        query.feesMin = feesMin;
    if (typeof feesMax === "number")
        query.feesMax = feesMax;
    if (typeof page === "number")
        query.page = page;
    if (typeof limit === "number")
        query.limit = limit;
    const result = (0, collegeRepository_1.getAllColleges)(query);
    return res.status(200).json(result);
}
async function getCollege(req, res) {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id)
        return res.status(400).json({ message: "Invalid college id" });
    const college = (0, collegeRepository_1.getCollegeById)(id);
    if (!college)
        return res.status(404).json({ message: "College not found" });
    return res.status(200).json(college);
}
//# sourceMappingURL=collegesController.js.map