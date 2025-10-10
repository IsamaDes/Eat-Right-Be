"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateTokenAndHash;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Generates a random token and returns both the plain token (for sending to the user)
 * and its bcrypt hash (for storing securely in the database).
 */
function generateTokenAndHash() {
    // 1️⃣ Generate a secure random token
    const token = crypto_1.default.randomBytes(32).toString("hex");
    // 2️⃣ Hash the token using bcrypt
    const saltRounds = 10;
    const tokenHash = bcryptjs_1.default.hashSync(token, saltRounds);
    // 3️⃣ Return both
    return { token, tokenHash };
}
