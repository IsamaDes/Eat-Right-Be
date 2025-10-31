"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refreshTokenService_1 = require("../services/auth/refreshTokenService");
const refreshTokenController = async (req, res) => {
    try {
        await (0, refreshTokenService_1.refreshAccessToken)(req, res);
    }
    catch (err) {
        console.error("Refresh token error:", err.message);
        res.status(403).json({ message: err.message || "Invalid or expired refresh token" });
    }
};
exports.default = refreshTokenController;
