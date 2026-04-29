"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collegesRouter = void 0;
const express_1 = require("express");
const collegesController_1 = require("../controllers/collegesController");
exports.collegesRouter = (0, express_1.Router)();
exports.collegesRouter.get("/colleges", collegesController_1.listColleges);
exports.collegesRouter.get("/colleges/:id", collegesController_1.getCollege);
//# sourceMappingURL=colleges.js.map