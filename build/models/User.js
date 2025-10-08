"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    age: { type: Number },
    healthHistory: [{ type: String }],
    wellness_goal: { type: String },
    tokenHash: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("User", userSchema);
