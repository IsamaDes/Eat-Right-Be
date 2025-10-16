"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../../models/User.js"));
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in ms
const MAX_ATTEMPTS = 3;
const loginUser = async (email, password) => {
    if (!email || !password)
        throw new Error("Email and password required");
    const user = await User_js_1.default.findOne({ email: email.toLowerCase() });
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
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "5d" });
    return {
        success: "Login successful",
        data: { id: user._id, name: user.name, email: user.email, role: user.role, token, refreshToken },
    };
};
exports.default = loginUser;
