"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAdminDashboard = void 0;
const adminService_1 = require("../../services/adminService");
// * Returns basic stats for the admin dashboard
const getAdminDashboard = async (req, res) => {
    try {
        const dashboardData = await (0, adminService_1.getAdminDashboardService)();
        res.status(200).json({
            success: true,
            data: dashboardData,
        });
    }
    catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getAdminDashboard = getAdminDashboard;
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await (0, adminService_1.createUserService)(name, email, password, role);
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
            }
        });
    }
    catch (error) {
        console.error("Registration error:", error.message);
        res.status(400).json({ message: error.message });
    }
};
exports.createUser = createUser;
