"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refreshTokenService_js_1 = require("../services/auth/refreshTokenService.js");
const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        const newAccessToken = await (0, refreshTokenService_js_1.refreshAccessToken)(refreshToken);
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.error("Refresh token error:", err.message);
        res.status(403).json({ message: err.message || "Invalid or expired refresh token" });
    }
};
exports.default = refreshTokenController;
