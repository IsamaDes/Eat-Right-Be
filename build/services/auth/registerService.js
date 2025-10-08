"use strict";
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { generateTokenAndHash } = require("../../utils/tokenUtil");
async function registerUser(name, email, password) {
    if (!email || !password)
        throw new Error("Email and password required");
    console.log(email);
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
        throw new Error("User already exists");
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashed,
    });
    const { token, tokenHash } = generateTokenAndHash();
    user.tokenHash = tokenHash;
    user.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await user.save();
    return {
        message: "User created. Verify email to activate account.",
        verificationToken: token,
    };
}
module.exports = registerUser;
