"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookiesStore_js_1 = __importDefault(require("../../utils/cookiesStore.js"));
const userRepository_js_1 = require("../../repositories/userRepository.js");
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;
const loginUser = async (email, password, res) => {
    if (!email || !password)
        throw new Error("Email and password required");
    const user = await userRepository_js_1.UserRepository.findByEmail(email);
    if (!user)
        throw new Error("User not found");
    //Check if account is locked
    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
        const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
        throw new Error(`Account locked. Try again in ${minutesLeft} minutes`);
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        // Increment failed attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        // Lock if attempts exceed max
        if (user.loginAttempts >= MAX_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_TIME);
            user.loginAttempts = 0; // reset count after locking
        }
        await userRepository_js_1.UserRepository.save(user);
        throw new Error("Invalid credentials");
    }
    // Reset failed attempts if successful
    user.loginAttempts = 0;
    user.lockUntil = null;
    await userRepository_js_1.UserRepository.save(user);
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "30m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    // Store tokens in secure cookies
    (0, cookiesStore_js_1.default)(res, accessToken, refreshToken);
    return {
        success: true,
        message: "Login successful",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.default = loginUser;
