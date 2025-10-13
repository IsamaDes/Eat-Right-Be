"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = __importDefault(require("../../models/User.js"));
const tokenUtils_js_1 = __importDefault(require("../../utils/tokenUtils.js"));
const validation_js_1 = require("../../utils/validation.js");
const registerUser = async (name, email, password, role) => {
    const { valid, errors, sanitized } = (0, validation_js_1.validateRegistrationInput)({
        name,
        email,
        password,
    });
    if (!valid) {
        throw new Error(errors.join(" "));
    }
    const cleanEmail = sanitized.email.toLowerCase();
    const existing = await User_js_1.default.findOne({ email: email.toLowerCase() });
    if (existing)
        throw new Error("User already exists");
    const hashed = await bcryptjs_1.default.hash(sanitized.password, 10);
    const { token, tokenHash } = (0, tokenUtils_js_1.default)();
    const user = new User_js_1.default({
        name: sanitized.name,
        email: cleanEmail,
        password: hashed,
        role,
        tokenHash,
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await user.save();
    return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        token,
    };
};
exports.default = registerUser;
