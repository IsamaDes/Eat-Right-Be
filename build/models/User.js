"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ["client", "nutritionist", "admin"], required: true },
    password: { type: String, required: true },
    age: { type: Number, default: null },
    healthHistory: [{ type: String, default: [] }],
    wellness_goal: { type: String, default: null },
    tokenHash: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
