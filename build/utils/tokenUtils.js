"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate a short-lived access token (e.g. 15 minutes)
 */
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate a long-lived refresh token (e.g. 7 days)
 */
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
