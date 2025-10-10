"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const tokenUtils_1 = __importDefault(require("../../utils/tokenUtils"));
const registerUser = async (name, email, password, role) => {
    if (!email || !password)
        throw new Error("Email and password required");
    const existing = await User_1.default.findOne({ email: email.toLowerCase() });
    if (existing)
        throw new Error("User already exists");
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const { token, tokenHash } = (0, tokenUtils_1.default)();
    const user = new User_1.default({
        name,
        email: email.toLowerCase(),
        password: hashed,
        role,
        tokenHash,
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await user.save();
    return {
        id: user._id,
        email: user.email,
        role: user.role,
        token,
    };
};
exports.default = registerUser;
