"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validation_js_1 = __importDefault(require("../../utils/validation.js"));
const userRepository_js_1 = require("../../repositories/userRepository.js");
const registerUser = async (name, email, password, role, res) => {
    const { valid, errors, sanitized } = (0, validation_js_1.default)({
        name,
        email,
        password,
    });
    if (!valid) {
        throw new Error(errors.join(" "));
    }
    const cleanEmail = sanitized.email;
    const existing = await userRepository_js_1.UserRepository.findByEmail(cleanEmail);
    if (existing)
        throw new Error("User already exists");
    const hashed = await bcryptjs_1.default.hash(sanitized.password, 10);
    const user = await userRepository_js_1.UserRepository.create({
        name: sanitized.name,
        email: cleanEmail,
        password: hashed,
        role,
    });
    console.log("Registration successful for:", user.email, user._id);
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};
exports.default = registerUser;
