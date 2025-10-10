"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = void 0;
const User_1 = __importDefault(require("../../models/User"));
/**
 * GET /api/admin/dashboard
 * Returns basic stats for the admin dashboard
 */
const getAdminDashboard = async (req, res) => {
    try {
        // Count users by role
        const clientCount = await User_1.default.countDocuments({ role: "client" });
        const nutritionistCount = await User_1.default.countDocuments({ role: "nutritionist" });
        const adminCount = await User_1.default.countDocuments({ role: "admin" });
        // Optional: fetch latest users, etc.
        const latestClients = await User_1.default.find({ role: "client" })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name email createdAt");
        res.status(200).json({
            success: true,
            data: {
                total: { clients: clientCount, nutritionists: nutritionistCount, admins: adminCount },
                latestClients,
            },
        });
    }
    catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getAdminDashboard = getAdminDashboard;
