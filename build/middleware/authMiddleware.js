"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../models/User.js"));
/**
 * Middleware to protect routes.
 * Verifies JWT token and attaches user info to req.user.
 */
const protect = async (req, res, next) => {
    let token;
    // Look for "Bearer <token>" in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Fetch user from DB (without password)
            const user = await User_js_1.default.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = user; // Attach user to request
            next();
        }
        catch (err) {
            console.error("JWT verification failed:", err);
            return res.status(401).json({ message: "Token invalid or expired" });
        }
    }
    else {
        return res.status(401).json({ message: "No token provided" });
    }
};
exports.default = protect;
