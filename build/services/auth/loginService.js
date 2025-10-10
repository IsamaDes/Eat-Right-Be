"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const loginUser = async (email, password) => {
    if (!email || !password)
        throw new Error("Email and password required");
    const user = await User_1.default.findOne({ email: email.toLowerCase() });
    if (!user)
        throw new Error("User not found");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return {
        success: "Login successful",
        data: { id: user._id, name: user.name, email: user.email, role: user.role, token },
    };
};
exports.default = loginUser;
