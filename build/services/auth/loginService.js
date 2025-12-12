"use strict";
// import type{ Response} from "express";
// import bcrypt from "bcryptjs";
// import jwt from  "jsonwebtoken";
// import sendAuthCookies from "../../utils/cookiesStore";
// import { UserRepository } from "../../repositories/userRepository";
// import { BadRequestError, UnauthorizedError } from "../../errors";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookiesStore_1 = __importDefault(require("../../utils/cookiesStore"));
const userRepository_1 = require("../../repositories/userRepository");
const errors_1 = require("../../errors");
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;
const loginUser = async (email, password, res) => {
    if (!email || !password)
        throw new errors_1.BadRequestError("Email and password required");
    const user = await userRepository_1.UserRepository.findByEmail(email);
    if (!user)
        throw new errors_1.UnauthorizedError("Invalid credentials");
    // Check if account is locked
    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
        const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
        throw new errors_1.UnauthorizedError(`Account locked. Try again in ${minutesLeft} minutes`);
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        // Increment failed attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        // Lock if attempts exceed max
        if (user.loginAttempts >= MAX_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_TIME);
            user.loginAttempts = 0;
            await userRepository_1.UserRepository.updateUser(user.id, {
                loginAttempts: user.loginAttempts,
                lockUntil: user.lockUntil
            });
            throw new errors_1.UnauthorizedError(`Account locked. Try again in ${Math.ceil(LOCK_TIME / 60000)} minutes`);
        }
        // Update failed attempts
        await userRepository_1.UserRepository.updateUser(user.id, {
            loginAttempts: user.loginAttempts,
        });
        throw new errors_1.UnauthorizedError("Invalid credentials");
    }
    await userRepository_1.UserRepository.updateUser(user.id, {
        loginAttempts: 0,
        lockUntil: null,
    });
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30m" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    // Store tokens in secure cookies
    (0, cookiesStore_1.default)(res, accessToken, refreshToken);
    return {
        success: true,
        message: "Login successful",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: accessToken,
        },
    };
};
exports.default = loginUser;
