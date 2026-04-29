"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const savedController_1 = require("../controllers/savedController");
exports.savedRouter = (0, express_1.Router)();
exports.savedRouter.post("/save-college", authMiddleware_1.requireAuth, savedController_1.toggleSavedCollege);
exports.savedRouter.get("/saved-colleges", authMiddleware_1.requireAuth, savedController_1.listSavedColleges);
//# sourceMappingURL=saved.js.map