"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blacklistedTokenSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired tokens
exports.default = mongoose_1.default.model("BlacklistedToken", blacklistedTokenSchema);
