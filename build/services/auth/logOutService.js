"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../../models/User.js"));
const BlackListedToken_js_1 = __importDefault(require("../../models/BlackListedToken.js"));
const logoutUser = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(refreshToken);
        if (!decoded || !decoded.exp) {
            throw new Error("Invalid token format");
        }
        const expiresAt = new Date(decoded.exp * 1000);
        await BlackListedToken_js_1.default.create({ token: refreshToken, expiresAt });
        const user = await User_js_1.default.findOne({ refreshToken });
        if (user) {
            user.refreshToken = "";
            await user.save();
        }
        ;
    }
    catch (error) {
        throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.default = logoutUser;
