"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const foodMenuSchema = new mongoose_1.default.Schema({
    date_created: { type: Date, default: Date.now },
    date_range: { type: String },
    Nutritionist: { type: mongoose_1.default.Schema.Types.ObjectId, ref: User_1.default },
    weeks: { types: Number },
    meal_plan: [
        {
            meal: [
                {
                    date: String,
                    day: String,
                    time: String,
                    meal: String, //breakfast||lunch||dinner
                    meal_name: String,
                    ingredients: [String],
                    calories: Number,
                },
            ],
        },
    ],
});
exports.default = mongoose_1.default.model("FoodMenu", foodMenuSchema);
