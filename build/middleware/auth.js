"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../models/User.js"));
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        // Extract token from header
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        // Verify token
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT secret not configured");
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        // Fetch user (exclude sensitive fields)
        const user = await User_js_1.default.findById(payload.id).select("-password -tokenHash -tokenExpiry");
        if (!user) {
            return res.status(401).json({ message: "Invalid token: user not found" });
        }
        // Attach user info to request object
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Auth Error:", err.message);
        return res
            .status(401)
            .json({ message: "Authentication failed", error: err.message });
    }
};
exports.default = auth;
