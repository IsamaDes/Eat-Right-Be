"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const loginUser = async (email, password) => {
    if (!email || !password)
        throw new Error("Email and password required");
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
        throw new Error("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return {
        success: "Login successful",
        data: { id: user._id, name: user.name, email: user.email, role: user.role, token },
    };
};
module.exports = loginUser;
