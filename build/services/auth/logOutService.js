"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenRepository_js_1 = require("../../repositories/tokenRepository.js");
const logoutUser = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(refreshToken);
        if (!decoded || !decoded.exp) {
            throw new Error("Invalid token format");
        }
        const expiresAt = new Date(decoded.exp * 1000);
        await tokenRepository_js_1.TokenRepository.blacklistToken(refreshToken, expiresAt);
    }
    catch (error) {
        throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.default = logoutUser;
