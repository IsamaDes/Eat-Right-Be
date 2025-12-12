"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentOnProject = exports.getMealPlanById = exports.updateMealPlan = exports.getMealPlans = exports.createMealPlan = exports.getClients = exports.getNutritionistProfile = exports.getNutritionistDashboard = void 0;
const NutrionistService_1 = require("../../services/nutrition/NutrionistService");
const userRepository_1 = require("../../repositories/userRepository");
const NutrionistService_2 = require("../../services/nutrition/NutrionistService");
const errors_1 = require("../../errors");
const NutritionistDashboardService_1 = __importDefault(require("../../services/nutrition/NutritionistDashboardService"));
const getNutritionistDashboard = async (req, res) => {
    try {
        const nutritionistId = req.user._id;
        const dashboard = await (0, NutritionistDashboardService_1.default)(nutritionistId);
        return res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
    catch (error) {
        console.error("Nutritionist Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
        });
    }
};
exports.getNutritionistDashboard = getNutritionistDashboard;
//Returns the profile of the logged-in nutritionist
const getNutritionistProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const nutritionist = await userRepository_1.UserRepository.findById(userId);
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
        const clients = await (0, NutrionistService_1.getNutritionistClients)(nutritionistId);
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
        const mealPlan = await (0, NutrionistService_1.createMealPlanService)(userId, req.body);
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
        const result = await (0, NutrionistService_1.getMealPlansService)(userId, req.query);
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
        const updatedPlan = await (0, NutrionistService_1.updateMealPlanService)(userId, id, req.body);
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
        const mealPlan = await (0, NutrionistService_1.getMealPlanByIdService)(userId, id);
        res.status(200).json({ success: true, data: mealPlan });
    }
    catch (err) {
        next(err);
    }
};
exports.getMealPlanById = getMealPlanById;
const commentOnProject = async (req, res, next) => {
    try {
        const { text } = req.body;
        const mealPlanId = req.params.id;
        const userId = req.params.userId;
        if (!text || !mealPlanId || !userId) {
            throw new errors_1.BadRequestError("Text, mealPlanId and authorId are required");
        }
        const updatedMealPlan = await (0, NutrionistService_2.commentOnMealPlanService)({ text, mealPlanId, userId });
        if (!updatedMealPlan) {
            throw new errors_1.NotFoundError("Meal plan not found");
        }
        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            data: updatedMealPlan,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.commentOnProject = commentOnProject;
