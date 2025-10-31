"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
const roleMiddleware_js_1 = __importDefault(require("../middleware/roleMiddleware.js"));
const adminController_js_1 = require("../controllers/admin/adminController.js");
// Only admins can access dashboard
router.get("/dashboard", authMiddleware_js_1.default, // User must be logged in
(0, roleMiddleware_js_1.default)("admin"), // User must be admin
adminController_js_1.getAdminDashboard);
exports.default = router;
