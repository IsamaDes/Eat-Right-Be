"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const availableMealSchema = new mongoose_1.default.Schema({
    chef_name: { type: String },
    meal_name: { type: String, required: true },
    nutrition_info: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("AvailableMeal", availableMealSchema);
