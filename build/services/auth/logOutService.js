"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenRepository_1 = require("../../repositories/tokenRepository");
const errors_1 = require("../../errors");
const logoutUser = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(refreshToken);
        if (!decoded || !decoded.exp) {
            throw new errors_1.UnauthorizedError("Invalid token format");
        }
        const expiresAt = new Date(decoded.exp * 1000);
        await tokenRepository_1.TokenRepository.blacklistToken(refreshToken, expiresAt);
    }
    catch (error) {
        throw new errors_1.BadRequestError(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.default = logoutUser;
