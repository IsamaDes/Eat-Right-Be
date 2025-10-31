"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_js_1 = require("../repositories/userRepository.js");
/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            console.log("No access token in cookies");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch user from DB (without password)
        const user = await userRepository_js_1.UserRepository.findById(decoded.id);
        req.user = { _id: user._id.toString(), email: user.email, role: user.role }; // Attach user to request
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};
exports.default = protect;
