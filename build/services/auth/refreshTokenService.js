"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenUtils_1 = require("../../utils/tokenUtils");
const userRepository_1 = require("../../repositories/userRepository");
const refreshAccessToken = async (req, res) => {
    console.log("refrshTokenAccessToken is being hit");
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
        throw new Error("No Refresh token provided");
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await userRepository_1.UserRepository.findById(decoded.userId);
        if (!user) {
            console.log("❌ User not found for ID:", decoded.userId);
            return res.status(401).json({ message: "User not found" });
        }
        const newAccessToken = (0, tokenUtils_1.generateAccessToken)(user.id.toString());
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 60 * 1000,
        });
        console.log("New access token set");
        res.json({ message: "Token refreshed" });
    }
    catch (err) {
        console.error("Error refreshing token:", err);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};
exports.refreshAccessToken = refreshAccessToken;
