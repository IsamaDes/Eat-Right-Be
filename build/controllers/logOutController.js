"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logOutService_js_1 = __importDefault(require("../services/auth/logOutService.js"));
const logoutUserController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            return res.sendStatus(204);
        await (0, logOutService_js_1.default)(refreshToken);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Logout failed"
        });
    }
};
exports.default = logoutUserController;
