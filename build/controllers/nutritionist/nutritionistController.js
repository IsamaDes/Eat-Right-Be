"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClients = exports.getNutritionistProfile = void 0;
const User_1 = __importDefault(require("../../models/User"));
const User_2 = __importDefault(require("../../models/User"));
/**
 * GET /api/nutritionist/profile
 * Returns the profile of the logged-in nutritionist
 */
const getNutritionistProfile = async (req, res) => {
    try {
        const userId = req.user._id; // user is attached by `protect` middleware
        const nutritionist = await User_1.default.findById(userId).select("-password -tokenHash");
        if (!nutritionist) {
            return res.status(404).json({ message: "Nutritionist not found" });
        }
        res.status(200).json({
            success: true,
            data: nutritionist,
        });
    }
    catch (error) {
        console.error("Error fetching nutritionist profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getNutritionistProfile = getNutritionistProfile;
/**
 * GET /api/nutritionist/clients
 * Returns all clients assigned to the logged-in nutritionist
 */
const getClients = async (req, res) => {
    try {
        const nutritionistId = req.user._id;
        // Example: assuming Client model has a field `nutritionist: ObjectId`
        const clients = await User_2.default.find({ nutritionist: nutritionistId }).select("-password -tokenHash -tokenExpiry");
        res.status(200).json({ success: true, data: clients });
    }
    catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getClients = getClients;
