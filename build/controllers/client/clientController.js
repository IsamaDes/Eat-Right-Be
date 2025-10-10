"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientProfile = void 0;
const User_1 = __importDefault(require("../../models/User"));
/**
 * GET /api/client/profile
 * Returns the logged-in client's profile
 */
const getClientProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const client = await User_1.default.findById(userId).select("-password -tokenHash -tokenExpiry");
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({
            success: true,
            data: client,
        });
    }
    catch (error) {
        console.error("Error fetching client profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getClientProfile = getClientProfile;
