"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientMealSchedule = exports.getClientMealPlans = exports.getClientProfile = void 0;
const errors_1 = require("../../errors");
const clientRepository_1 = require("../../repositories/clientRepository");
const clientService_1 = require("../../services/clientService");
// Returns the logged-in client's profile
const getClientProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId)
            throw new errors_1.UnauthorizedError("Invalid user Id");
        const client = await clientRepository_1.ClientRepository.getClientProfile(userId);
        if (!client) {
            throw new errors_1.NotFoundError("Client profile not found");
        }
        res.status(200).json({
            success: true,
            data: {
                id: client.user.id,
                name: client.user.name,
                email: client.user.email,
                role: client.user.role,
                // Client-specific data (from Client table)
                clientId: client.id,
                healthGoal: client.healthGoal,
                age: client.age,
                subscription: client.subscription,
                assignedNutritionistId: client.assignedNutritionistId,
                assignedNutritionist: client.assignedNutritionist
            },
        });
    }
    catch (error) {
        console.error("Error fetching client profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getClientProfile = getClientProfile;
const getClientMealPlans = async (req, res) => {
    try {
        const clientId = req.user?._id;
        if (!clientId)
            return res.status(400).json({ success: false, message: 'clientId is required' });
        const data = await clientService_1.clientService.getClientMealPlans(clientId);
        res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getClientMealPlans = getClientMealPlans;
const getClientMealSchedule = async (req, res) => {
};
exports.getClientMealSchedule = getClientMealSchedule;
