"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealPlanById = exports.updateMealPlan = exports.getMealPlans = exports.createMealPlan = exports.getClients = exports.getNutritionistProfile = void 0;
const nutrition_1 = require("../../services/nutrition");
const userRepository_js_1 = require("../../repositories/userRepository.js");
//Returns the profile of the logged-in nutritionist
const getNutritionistProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const nutritionist = await userRepository_js_1.UserRepository.findById(userId);
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
// Returns all clients assigned to the logged-in nutritionist
const getClients = async (req, res) => {
    try {
        const nutritionistId = req.user._id;
        // Find all clients assigned to this nutritionist
        const clients = await userRepository_js_1.UserRepository.findClientsByNutritionist(nutritionistId);
        res.status(200).json({ success: true, data: clients });
    }
    catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getClients = getClients;
const createMealPlan = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const mealPlan = await (0, nutrition_1.createMealPlanService)(userId, req.body);
        res.status(201).json({ success: true, data: mealPlan });
    }
    catch (err) {
        next(err);
    }
};
exports.createMealPlan = createMealPlan;
const getMealPlans = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await (0, nutrition_1.getMealPlansService)(userId, req.query);
        res.status(200).json({ success: true, ...result });
    }
    catch (err) {
        next(err);
    }
};
exports.getMealPlans = getMealPlans;
const updateMealPlan = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const updatedPlan = await (0, nutrition_1.updateMealPlanService)(userId, id, req.body);
        res.status(200).json({ success: true, data: updatedPlan });
    }
    catch (err) {
        next(err);
    }
};
exports.updateMealPlan = updateMealPlan;
const getMealPlanById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const mealPlan = await (0, nutrition_1.getMealPlanByIdService)(userId, id);
        res.status(200).json({ success: true, data: mealPlan });
    }
    catch (err) {
        next(err);
    }
};
exports.getMealPlanById = getMealPlanById;
