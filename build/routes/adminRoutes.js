"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
// const  authorizeRoles  = require("../middleware/roleMiddleware");
// const getAdminDashboard  = require("../controllers/admin/adminController");
// Only admins can access dashboard
// router.get(
//   "/dashboard",
//   protect,                  // User must be logged in
//   authorizeRoles("admin"),  // User must be admin
//   getAdminDashboard
// );
// Example: general admin route that any logged-in user can see (rare for admin)
router.get("/profile", authMiddleware_js_1.default, (req, res) => {
    res.json({ message: "This is the admin profile page", user: req.user });
});
exports.default = router;
