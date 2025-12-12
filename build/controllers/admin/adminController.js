"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientProfile = exports.adminProfile = void 0;
const adminService_1 = require("../../services/adminService");
const errors_1 = require("../../errors");
const adminProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId)
            throw new errors_1.UnauthorizedError("Invalid user Id");
        const profileData = await (0, adminService_1.getAdminProfileService)(userId);
        if (!profileData) {
            throw new errors_1.NotFoundError("Admin profile not found");
        }
        res.status(200).json({
            success: true,
            data: profileData,
        });
    }
    catch (error) {
        console.error("Admin profile error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.adminProfile = adminProfile;
const getClientProfile = async (req, res) => {
    try {
        const adminId = req.user?._id;
        if (!adminId)
            throw new errors_1.UnauthorizedError("Unauthorized");
        const { clientId } = req.params;
        if (!clientId)
            throw new errors_1.NotFoundError("Client ID required");
        const data = await (0, adminService_1.getClientProfileService)(clientId);
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};
exports.getClientProfile = getClientProfile;
