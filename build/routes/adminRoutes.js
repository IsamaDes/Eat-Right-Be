"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const adminController_1 = require("../controllers/admin/adminController");
const router = (0, express_1.Router)();
// Only admins can access dashboard
router.get("/dashboard", authMiddleware_1.protect, // User must be logged in
(0, roleMiddleware_1.authorizeRoles)("admin"), // User must be admin
adminController_1.getAdminDashboard);
// Example: general admin route that any logged-in user can see (rare for admin)
router.get("/profile", authMiddleware_1.protect, (req, res) => {
    res.json({ message: "This is the admin profile page", user: req.user });
});
exports.default = router;
