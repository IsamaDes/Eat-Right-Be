"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const clientController_1 = require("../controllers/client/clientController");
const router = (0, express_1.Router)();
// Clients can access their profile
router.get("/profile", authMiddleware_1.protect, (0, roleMiddleware_1.authorizeRoles)("client"), clientController_1.getClientProfile);
exports.default = router;
