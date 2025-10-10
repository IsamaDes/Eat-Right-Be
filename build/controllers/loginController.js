"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginUser = require("../services/auth/loginService");
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const response = await loginUser(email, password);
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
};
module.exports = loginController;
