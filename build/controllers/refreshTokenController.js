"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { refreshAccessToken } = require("../services/auth/refreshTokenService");
const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        const newAccessToken = await refreshAccessToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.error("Refresh token error:", err.message);
        res.status(403).json({ message: err.message || "Invalid or expired refresh token" });
    }
};
module.exports = refreshTokenController;
