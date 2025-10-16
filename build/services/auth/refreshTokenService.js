"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../../models/User.js"));
const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken)
        throw new Error("No token provided");
    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User_js_1.default.findById(decoded.userId);
    if (!user)
        throw new Error("Invalid token");
    // Check: token matches the one stored in DB
    if (user.refreshToken !== refreshToken) {
        throw new Error("Token mismatch");
    }
    // ✅ Create new access token
    const newAccessToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    return newAccessToken;
};
exports.refreshAccessToken = refreshAccessToken;
