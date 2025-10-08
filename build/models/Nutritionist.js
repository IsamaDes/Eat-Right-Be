"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nutritionistSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    years_of_experience: { type: Number, required: true },
    age: { type: Number },
    qualification: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Nutritionist", nutritionistSchema);
