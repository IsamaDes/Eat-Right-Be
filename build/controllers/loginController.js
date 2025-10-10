"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginService_1 = __importDefault(require("../services/auth/loginService"));
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const response = await (0, loginService_1.default)(email, password);
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.default = loginController;
