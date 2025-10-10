"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const registerUser = require("../services/auth/registerService");
const registerController = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role)
            return res.status(400).json({ message: "All fields are required" });
        const response = await registerUser(name, email, password, role);
        res.status(201).json(response);
    }
    catch (err) {
        next(err);
    }
};
module.exports = registerController;
