"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nutritionist = require("../../models/User");
const Client = require("../../models/User");
/**
 * GET /api/nutritionist/profile
 * Returns the profile of the logged-in nutritionist
 */
const getNutritionistProfile = async (req, res) => {
    try {
        const userId = req.user._id; // user is attached by `protect` middleware
        const nutritionist = await Nutritionist.findById(userId).select("-password -tokenHash");
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
/**
 * GET /api/nutritionist/clients
 * Returns all clients assigned to the logged-in nutritionist
 */
const getClients = async (req, res) => {
    try {
        const nutritionistId = req.user._id;
        // Example: assuming Client model has a field `nutritionist: ObjectId`
        const clients = await Client.find({ nutritionist: nutritionistId }).select("-password -tokenHash -tokenExpiry");
        res.status(200).json({ success: true, data: clients });
    }
    catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
    getNutritionistProfile,
    getClients
};
